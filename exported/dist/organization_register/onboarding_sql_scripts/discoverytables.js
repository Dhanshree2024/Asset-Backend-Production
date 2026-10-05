"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiscoveryTablesScript = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
let DiscoveryTablesScript = class DiscoveryTablesScript {
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    async createDiscoveryTables(schemaName) {
        const query = `
-- ========================= discovery_device =========================
CREATE TABLE IF NOT EXISTS ${schemaName}.discovery_device (
    -- BIGSERIAL (not uuid+gen_random_uuid) to match every other table in this
    -- app and avoid a pgcrypto / PG13 dependency that isn't guaranteed present.
    id                   bigserial PRIMARY KEY,
    site                 text,
    ip                   inet NOT NULL,
    mac                  macaddr,
    hostname             text,
    domain               text,
    logged_in_user       text,
    os                   text,
    vendor               text,
    category             text NOT NULL DEFAULT 'unknown',
    category_confidence  numeric(3,2) NOT NULL DEFAULT 0,
    model                text,
    segment              text,
    open_ports           integer[] NOT NULL DEFAULT '{}',
    services             text[]    NOT NULL DEFAULT '{}',
    sources              text[]    NOT NULL DEFAULT '{}',
    first_seen           timestamptz NOT NULL DEFAULT now(),
    last_seen            timestamptz NOT NULL DEFAULT now(),
    specs                jsonb
);

-- IP is the stable identity on a subnet (spec §3). Unique so re-runs upsert
-- rather than duplicate. COALESCE(site,'') keeps multi-site probes with
-- overlapping RFC1918 ranges from colliding.
CREATE UNIQUE INDEX IF NOT EXISTS uq_discovery_device_site_ip
    ON ${schemaName}.discovery_device (COALESCE(site, ''), ip);

CREATE INDEX IF NOT EXISTS idx_discovery_device_category
    ON ${schemaName}.discovery_device (category);
CREATE INDEX IF NOT EXISTS idx_discovery_device_last_seen
    ON ${schemaName}.discovery_device (last_seen);

-- ========================= installed_software =========================
CREATE TABLE IF NOT EXISTS ${schemaName}.installed_software (
    id               bigserial PRIMARY KEY,
    device_id        bigint NOT NULL
                     REFERENCES ${schemaName}.discovery_device (id) ON DELETE CASCADE,
    name             text NOT NULL,
    version          text,
    publisher        text,
    -- Contract v2 (spec §13): install metadata + the identifiers that make
    -- controlled uninstall (spec §19) possible.
    install_date     timestamptz DEFAULT now(),
    install_location text,
    architecture     text,
    product_code     text,
    uninstall_string text,
    reported_at      timestamptz NOT NULL DEFAULT now()
);

-- Backfill: install_date used to have no default; schemas onboarded before
-- this ran would otherwise keep inserting nulls.
ALTER TABLE ${schemaName}.installed_software
    ALTER COLUMN install_date SET DEFAULT now();

CREATE INDEX IF NOT EXISTS idx_installed_software_device
    ON ${schemaName}.installed_software (device_id);
-- Supports "who has app X" queries.
CREATE INDEX IF NOT EXISTS idx_installed_software_name
    ON ${schemaName}.installed_software (lower(name));
CREATE INDEX IF NOT EXISTS idx_installed_software_product_code
    ON ${schemaName}.installed_software (product_code)
    WHERE product_code IS NOT NULL;

-- ========================= discovery_scan_run =========================
CREATE TABLE IF NOT EXISTS ${schemaName}.discovery_scan_run (
    id            bigserial PRIMARY KEY,
    site          text,
    started_at    timestamptz NOT NULL DEFAULT now(),
    finished_at   timestamptz,
    duration_ms   integer,
    device_count  integer,
    scanners      text[] NOT NULL DEFAULT '{}'
);

CREATE INDEX IF NOT EXISTS idx_discovery_scan_run_started
    ON ${schemaName}.discovery_scan_run (started_at DESC);

-- ========================= discovery_config =========================
-- One row per org schema (a singleton). snmp_community stored encrypted at the
-- app layer before insert.
CREATE TABLE IF NOT EXISTS ${schemaName}.discovery_config (
    id                  bigserial PRIMARY KEY,
    segments            jsonb   NOT NULL DEFAULT '[]'::jsonb,
    scan_cron           text    NOT NULL DEFAULT '*/15 * * * *',
    fingerprint_ports   integer[] NOT NULL DEFAULT
                        '{21,22,23,53,80,81,88,139,443,445,515,554,631,1900,3389,4370,5000,7001,8000,8001,8080,8081,8443,8554,8899,9000,9100,34567,37777,49152}',
    snmp_enabled        boolean NOT NULL DEFAULT false,
    snmp_community      text,
    snmp_sweep_all      boolean NOT NULL DEFAULT false,
    snmp_devices        inet[]  NOT NULL DEFAULT '{}',
    auto_detect_subnets boolean NOT NULL DEFAULT true,
    updated_at          timestamptz NOT NULL DEFAULT now(),
    -- Phase 2 knobs (perf history retention, event-log collection defaults, etc).
    phase2_settings     jsonb   NOT NULL DEFAULT
                        '{"perfRawDays": 7, "eventLogCron": null, "eventLogDays": 30, "jobHistoryDays": 90, "perfRollupDays": 90, "eventLogDefaults": {"levels": ["Critical", "Error", "Warning"], "logNames": ["System", "Application"], "maxEntries": 200, "sinceHours": 24}}'::jsonb
);

-- Backfill phase2_settings for schemas that already had discovery_config
-- from before this column existed (CREATE TABLE IF NOT EXISTS is a no-op on
-- those, so the column has to be added explicitly).
ALTER TABLE ${schemaName}.discovery_config
    ADD COLUMN IF NOT EXISTS phase2_settings jsonb NOT NULL DEFAULT
    '{"perfRawDays": 7, "eventLogCron": null, "eventLogDays": 30, "jobHistoryDays": 90, "perfRollupDays": 90, "eventLogDefaults": {"levels": ["Critical", "Error", "Warning"], "logNames": ["System", "Application"], "maxEntries": 200, "sinceHours": 24}}'::jsonb;

-- Seed the singleton config row if the table is empty (id auto-fills from the
-- bigserial sequence; all other columns take their defaults).
INSERT INTO ${schemaName}.discovery_config (updated_at)
SELECT now()
WHERE NOT EXISTS (SELECT 1 FROM ${schemaName}.discovery_config);

-- ========================= discovery_credential =========================
-- Reusable named credentials (Windows local/domain, SNMP, SSH, LDAP bind)
-- referenced by discovery_ad_config and (eventually) by scan/job configs.
-- secret_enc is encrypted at the app layer before insert, same pattern as
-- discovery_config.snmp_community.
CREATE TABLE IF NOT EXISTS ${schemaName}.discovery_credential (
    id               bigserial PRIMARY KEY,
    name             text NOT NULL,
    kind             text NOT NULL DEFAULT 'windows-local',
    username         text,
    domain           text,
    secret_enc       text,
    description      text,
    is_default       boolean NOT NULL DEFAULT false,
    last_tested_at   timestamptz,
    last_test_result text,
    last_test_error  text,
    created_by       bigint,
    created_at       timestamptz NOT NULL DEFAULT now(),
    updated_by       bigint,
    updated_at       timestamptz NOT NULL DEFAULT now(),
    deleted_at       timestamptz,
    CONSTRAINT chk_discovery_credential_kind CHECK (
        kind IN ('windows-local','windows-domain','snmp-v2c','ssh','ldap-bind')
    )
);

-- Soft-deleted rows don't block reusing a name.
CREATE UNIQUE INDEX IF NOT EXISTS uq_discovery_credential_name
    ON ${schemaName}.discovery_credential (lower(name))
    WHERE deleted_at IS NULL;

-- ========================= discovery_agent =========================
-- Windows Agent registry (spec §4.1/§11). key_hash is a SHA-256 of the
-- per-agent secret minted at registration — plaintext is never stored.
CREATE TABLE IF NOT EXISTS ${schemaName}.discovery_agent (
    id              bigserial PRIMARY KEY,
    agent_uuid      text NOT NULL UNIQUE,
    hostname        text,
    ip              inet,
    os              text,
    version         text,
    key_hash        text NOT NULL UNIQUE,
    device_id       bigint REFERENCES ${schemaName}.discovery_device (id) ON DELETE SET NULL,
    registered_at   timestamptz NOT NULL DEFAULT now(),
    last_heartbeat  timestamptz,
    revoked_at      timestamptz
);

-- Backfill the uniqueness guarantee for schemas that already had
-- discovery_agent before key_hash was made unique (two agents must never
-- share a secret hash). DROP+ADD keeps this rerun-safe since Postgres has no
-- "ADD CONSTRAINT IF NOT EXISTS".
ALTER TABLE ${schemaName}.discovery_agent
    DROP CONSTRAINT IF EXISTS discovery_agent_key_hash_key;
ALTER TABLE ${schemaName}.discovery_agent
    ADD CONSTRAINT discovery_agent_key_hash_key UNIQUE (key_hash);

CREATE INDEX IF NOT EXISTS idx_discovery_agent_heartbeat
    ON ${schemaName}.discovery_agent (last_heartbeat DESC NULLS LAST);
CREATE INDEX IF NOT EXISTS idx_discovery_agent_hostname
    ON ${schemaName}.discovery_agent (lower(hostname));

-- ========================= discovery_remote_job =========================
-- Job queue: agents claim queued jobs atomically (FOR UPDATE SKIP LOCKED) and
-- report results. Phase 2 adds device targeting, priority, and the
-- human-approval-gating workflow (needs_approval / approved_* / rejected_reason)
-- for destructive jobs, plus scheduling, progress reporting, and cancellation.
CREATE TABLE IF NOT EXISTS ${schemaName}.discovery_remote_job (
    id                 bigserial PRIMARY KEY,
    agent_id           bigint NOT NULL
                       REFERENCES ${schemaName}.discovery_agent (id) ON DELETE RESTRICT,
    type               text NOT NULL,
    payload            jsonb,
    status             text NOT NULL DEFAULT 'queued',
    attempt            integer NOT NULL DEFAULT 0,
    max_attempts       integer NOT NULL DEFAULT 3,
    result             jsonb,
    error              text,
    created_at         timestamptz NOT NULL DEFAULT now(),
    claimed_at         timestamptz,
    finished_at        timestamptz,
    device_id          bigint REFERENCES ${schemaName}.discovery_device (id) ON DELETE SET NULL,
    target_label       text,
    priority           integer NOT NULL DEFAULT 5,
    requested_by       bigint,
    requested_by_name  text,
    needs_approval     boolean NOT NULL DEFAULT false,
    approved_by        bigint,
    approved_by_name   text,
    approved_at        timestamptz,
    rejected_reason    text,
    scheduled_for      timestamptz,
    started_at         timestamptz,
    progress           jsonb,
    progress_at        timestamptz,
    exit_code          integer,
    log_ref            text,
    expires_at         timestamptz,
    cancelled_at       timestamptz,
    cancelled_by       bigint,
    cancel_reason      text,
    CONSTRAINT chk_discovery_remote_job_status CHECK (
        status IN ('pending_approval','queued','claimed','running','succeeded','failed','timed_out','cancelled','expired','rejected')
    ),
    CONSTRAINT chk_discovery_remote_job_attempts CHECK (attempt >= 0 AND max_attempts > 0)
);

-- Backfill for schemas onboarded before Phase 2: add every new column
-- individually so re-running this against an already-populated table is safe.
ALTER TABLE ${schemaName}.discovery_remote_job
    ADD COLUMN IF NOT EXISTS device_id          bigint,
    ADD COLUMN IF NOT EXISTS target_label       text,
    ADD COLUMN IF NOT EXISTS priority           integer NOT NULL DEFAULT 5,
    ADD COLUMN IF NOT EXISTS requested_by       bigint,
    ADD COLUMN IF NOT EXISTS requested_by_name  text,
    ADD COLUMN IF NOT EXISTS needs_approval     boolean NOT NULL DEFAULT false,
    ADD COLUMN IF NOT EXISTS approved_by        bigint,
    ADD COLUMN IF NOT EXISTS approved_by_name   text,
    ADD COLUMN IF NOT EXISTS approved_at        timestamptz,
    ADD COLUMN IF NOT EXISTS rejected_reason    text,
    ADD COLUMN IF NOT EXISTS scheduled_for      timestamptz,
    ADD COLUMN IF NOT EXISTS started_at         timestamptz,
    ADD COLUMN IF NOT EXISTS progress           jsonb,
    ADD COLUMN IF NOT EXISTS progress_at        timestamptz,
    ADD COLUMN IF NOT EXISTS exit_code          integer,
    ADD COLUMN IF NOT EXISTS log_ref            text,
    ADD COLUMN IF NOT EXISTS expires_at         timestamptz,
    ADD COLUMN IF NOT EXISTS cancelled_at       timestamptz,
    ADD COLUMN IF NOT EXISTS cancelled_by       bigint,
    ADD COLUMN IF NOT EXISTS cancel_reason      text;

-- agent_id used to cascade-delete jobs with their agent; it now restricts,
-- so job history survives agent deletion/deregistration.
ALTER TABLE ${schemaName}.discovery_remote_job
    DROP CONSTRAINT IF EXISTS discovery_remote_job_agent_id_fkey;
ALTER TABLE ${schemaName}.discovery_remote_job
    ADD CONSTRAINT discovery_remote_job_agent_id_fkey FOREIGN KEY (agent_id)
        REFERENCES ${schemaName}.discovery_agent (id) ON DELETE RESTRICT;

ALTER TABLE ${schemaName}.discovery_remote_job
    DROP CONSTRAINT IF EXISTS discovery_remote_job_device_id_fkey;
ALTER TABLE ${schemaName}.discovery_remote_job
    ADD CONSTRAINT discovery_remote_job_device_id_fkey FOREIGN KEY (device_id)
        REFERENCES ${schemaName}.discovery_device (id) ON DELETE SET NULL;

-- Status CHECK grew two values (pending_approval, expired); attempts CHECK is
-- new. DROP+ADD since Postgres can't ALTER a CHECK constraint's expression.
ALTER TABLE ${schemaName}.discovery_remote_job
    DROP CONSTRAINT IF EXISTS chk_discovery_remote_job_status;
ALTER TABLE ${schemaName}.discovery_remote_job
    ADD CONSTRAINT chk_discovery_remote_job_status CHECK (
        status IN ('pending_approval','queued','claimed','running','succeeded','failed','timed_out','cancelled','expired','rejected')
    );

ALTER TABLE ${schemaName}.discovery_remote_job
    DROP CONSTRAINT IF EXISTS chk_discovery_remote_job_attempts;
ALTER TABLE ${schemaName}.discovery_remote_job
    ADD CONSTRAINT chk_discovery_remote_job_attempts CHECK (attempt >= 0 AND max_attempts > 0);

CREATE INDEX IF NOT EXISTS idx_discovery_remote_job_poll
    ON ${schemaName}.discovery_remote_job (agent_id, status, created_at)
    WHERE status = 'queued';
CREATE INDEX IF NOT EXISTS idx_discovery_remote_job_created
    ON ${schemaName}.discovery_remote_job (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_discovery_remote_job_device
    ON ${schemaName}.discovery_remote_job (device_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_discovery_remote_job_active_device
    ON ${schemaName}.discovery_remote_job (device_id)
    WHERE status IN ('claimed','running') AND device_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_discovery_remote_job_inflight
    ON ${schemaName}.discovery_remote_job (claimed_at)
    WHERE status IN ('claimed','running');
CREATE INDEX IF NOT EXISTS idx_discovery_remote_job_status
    ON ${schemaName}.discovery_remote_job (status, scheduled_for);
CREATE INDEX IF NOT EXISTS idx_discovery_remote_job_type
    ON ${schemaName}.discovery_remote_job (type, created_at DESC);
-- Renamed from the org-specific "idx_rs_asc_remote_job_claim" — see class docstring.
CREATE INDEX IF NOT EXISTS idx_discovery_remote_job_claim
    ON ${schemaName}.discovery_remote_job (agent_id, status);

-- ========================= discovery_ad_computer =========================
-- Active Directory computer objects synced in via LDAP (spec: AD sync).
-- sam_account_name is the stable AD identity, so upserts key off it.
CREATE TABLE IF NOT EXISTS ${schemaName}.discovery_ad_computer (
    id                  bigserial PRIMARY KEY,
    sam_account_name    text NOT NULL,
    dns_host_name       text,
    distinguished_name  text,
    operating_system    text,
    os_version          text,
    enabled             boolean,
    last_logon_at       timestamptz,
    when_created        timestamptz,
    device_id           bigint REFERENCES ${schemaName}.discovery_device (id) ON DELETE SET NULL,
    first_synced_at     timestamptz NOT NULL DEFAULT now(),
    last_synced_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_discovery_ad_computer_host
    ON ${schemaName}.discovery_ad_computer (lower(dns_host_name));
CREATE UNIQUE INDEX IF NOT EXISTS uq_discovery_ad_computer_sam
    ON ${schemaName}.discovery_ad_computer (lower(sam_account_name));

-- ========================= discovery_ad_config =========================
-- One row per org schema (a singleton), mirrors discovery_config. Holds the
-- LDAP/AD sync connection settings.
CREATE TABLE IF NOT EXISTS ${schemaName}.discovery_ad_config (
    id                   bigserial PRIMARY KEY,
    enabled              boolean NOT NULL DEFAULT false,
    domain_name          text,
    ldap_url             text,
    use_ldaps            boolean NOT NULL DEFAULT true,
    base_dn              text,
    bind_credential_id   bigint,
    computer_ou_filter   text,
    last_bind_test_at    timestamptz,
    last_bind_result     text,
    last_bind_error      text,
    updated_by           bigint,
    updated_at           timestamptz NOT NULL DEFAULT now()
);

-- discovery_credential is created above (earlier in this script) so this FK
-- can be added unconditionally, including as a backfill for schemas that got
-- discovery_ad_config before discovery_credential existed.
ALTER TABLE ${schemaName}.discovery_ad_config
    DROP CONSTRAINT IF EXISTS discovery_ad_config_bind_credential_id_fkey;
ALTER TABLE ${schemaName}.discovery_ad_config
    ADD CONSTRAINT discovery_ad_config_bind_credential_id_fkey FOREIGN KEY (bind_credential_id)
        REFERENCES ${schemaName}.discovery_credential (id) ON DELETE SET NULL;

-- Seed the singleton config row if the table is empty.
INSERT INTO ${schemaName}.discovery_ad_config (updated_at)
SELECT now()
WHERE NOT EXISTS (SELECT 1 FROM ${schemaName}.discovery_ad_config);

-- ========================= discovery_audit_log =========================
-- Append-only audit trail for discovery actions. Rows are made immutable by
-- the trigger below (no UPDATE/DELETE once written).
CREATE TABLE IF NOT EXISTS ${schemaName}.discovery_audit_log (
    id               bigserial PRIMARY KEY,
    actor_user_id    bigint,
    actor_name       text,
    actor_ip         text,
    action           text NOT NULL,
    target_type      text,
    target_id        text,
    target_label     text,
    params_redacted  jsonb,
    result           text NOT NULL DEFAULT 'ok',
    error            text,
    request_id       text,
    job_id           bigint,
    created_at       timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_discovery_audit_action
    ON ${schemaName}.discovery_audit_log (action, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_discovery_audit_actor
    ON ${schemaName}.discovery_audit_log (actor_user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_discovery_audit_created
    ON ${schemaName}.discovery_audit_log (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_discovery_audit_target
    ON ${schemaName}.discovery_audit_log (target_type, target_id);

CREATE OR REPLACE FUNCTION ${schemaName}.discovery_audit_log_immutable()
RETURNS trigger AS $body$
BEGIN
    RAISE EXCEPTION 'discovery_audit_log rows are immutable and cannot be updated or deleted';
END;
$body$ LANGUAGE plpgsql;

-- DROP + CREATE (not CREATE OR REPLACE TRIGGER, which is PG14+) to stay
-- consistent with this file's PG13 compatibility target.
DROP TRIGGER IF EXISTS trg_discovery_audit_immutable ON ${schemaName}.discovery_audit_log;
CREATE TRIGGER trg_discovery_audit_immutable
    BEFORE DELETE OR UPDATE
    ON ${schemaName}.discovery_audit_log
    FOR EACH ROW
    EXECUTE FUNCTION ${schemaName}.discovery_audit_log_immutable();

-- ========================= discovery_device_service =========================
-- Windows services inventory per device, replaced wholesale each collection
-- (uq index is (device_id, name), so the app upserts on that pair).
CREATE TABLE IF NOT EXISTS ${schemaName}.discovery_device_service (
    id            bigserial PRIMARY KEY,
    device_id     bigint NOT NULL
                  REFERENCES ${schemaName}.discovery_device (id) ON DELETE CASCADE,
    name          text NOT NULL,
    display_name  text,
    status        text,
    start_type    text,
    account       text,
    binary_path   text,
    description   text,
    collected_at  timestamptz NOT NULL DEFAULT now(),
    job_id        bigint
);

CREATE UNIQUE INDEX IF NOT EXISTS uq_discovery_device_service
    ON ${schemaName}.discovery_device_service (device_id, name);

-- ========================= discovery_event_log =========================
-- Windows Event Log entries collected per device/log/record. record_id is
-- the Windows event record number, unique per (device, log) when present.
CREATE TABLE IF NOT EXISTS ${schemaName}.discovery_event_log (
    id            bigserial PRIMARY KEY,
    device_id     bigint NOT NULL
                  REFERENCES ${schemaName}.discovery_device (id) ON DELETE CASCADE,
    log_name      text NOT NULL,
    event_id      integer,
    level         text,
    source        text,
    message       text,
    time_created  timestamptz,
    record_id     bigint,
    collected_at  timestamptz NOT NULL DEFAULT now(),
    job_id        bigint
);

CREATE INDEX IF NOT EXISTS idx_discovery_event_log_device_time
    ON ${schemaName}.discovery_event_log (device_id, time_created DESC);
CREATE UNIQUE INDEX IF NOT EXISTS uq_discovery_event_log_record
    ON ${schemaName}.discovery_event_log (device_id, log_name, record_id)
    WHERE record_id IS NOT NULL;

-- ========================= discovery_net_diag_run =========================
-- Ad-hoc network diagnostics (ping/tracert/etc) run against a device or an
-- arbitrary target, initiated by a user or a job.
CREATE TABLE IF NOT EXISTS ${schemaName}.discovery_net_diag_run (
    id            bigserial PRIMARY KEY,
    device_id     bigint REFERENCES ${schemaName}.discovery_device (id) ON DELETE SET NULL,
    tool          text NOT NULL,
    target        text NOT NULL,
    params        jsonb,
    output        text,
    exit_code     integer,
    duration_ms   integer,
    ran_by        bigint,
    job_id        bigint,
    created_at    timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT chk_discovery_net_diag_tool CHECK (
        tool IN ('ping','tracert','pathping','nbtstat','http','https','tcp-port')
    )
);

CREATE INDEX IF NOT EXISTS idx_discovery_net_diag_created
    ON ${schemaName}.discovery_net_diag_run (created_at DESC);

-- ========================= discovery_perf_rollup_hourly =========================
-- Hourly rollups of discovery_perf_sample, one row per device per hour.
-- Composite PK (device_id, hour_start) doubles as the upsert key — no
-- surrogate id needed.
CREATE TABLE IF NOT EXISTS ${schemaName}.discovery_perf_rollup_hourly (
    device_id        bigint NOT NULL
                     REFERENCES ${schemaName}.discovery_device (id) ON DELETE CASCADE,
    hour_start       timestamptz NOT NULL,
    samples          integer NOT NULL,
    cpu_avg          real,
    cpu_max          real,
    mem_avg          real,
    mem_max          real,
    disk_read_avg    real,
    disk_write_avg   real,
    net_in_avg       real,
    net_out_avg      real,
    PRIMARY KEY (device_id, hour_start)
);

-- ========================= discovery_perf_sample =========================
-- Raw per-collection performance samples, rolled up hourly into
-- discovery_perf_rollup_hourly and pruned per discovery_config.phase2_settings
-- (perfRawDays / perfRollupDays).
CREATE TABLE IF NOT EXISTS ${schemaName}.discovery_perf_sample (
    id               bigserial PRIMARY KEY,
    device_id        bigint NOT NULL
                     REFERENCES ${schemaName}.discovery_device (id) ON DELETE CASCADE,
    sampled_at       timestamptz NOT NULL,
    cpu_pct          real,
    mem_used_pct     real,
    mem_used_mb      real,
    disk_read_kbps   real,
    disk_write_kbps  real,
    net_in_kbps      real,
    net_out_kbps     real,
    metrics          jsonb,
    job_id           bigint
);

CREATE INDEX IF NOT EXISTS idx_discovery_perf_sample_device_time
    ON ${schemaName}.discovery_perf_sample (device_id, sampled_at DESC);

-- ========================= discovery_software_package =========================
-- Phase 3 (spec §3.6.2): software package repository — upload metadata,
-- sha256, silent install/uninstall args, detection rule, approval workflow,
-- supersedence.
CREATE TABLE IF NOT EXISTS ${schemaName}.discovery_software_package (
    id                    bigserial PRIMARY KEY,
    name                  text NOT NULL,
    version               text NOT NULL,
    installer_type        text NOT NULL CHECK (installer_type IN ('msi','exe','ps1')),
    architecture          text NOT NULL DEFAULT 'x64' CHECK (architecture IN ('x64','x86','any')),
    file_name             text NOT NULL,
    file_ref              text NOT NULL,
    size_bytes            bigint NOT NULL DEFAULT 0,
    sha256                text NOT NULL,
    signature_subject     text,
    require_signature     boolean NOT NULL DEFAULT false,
    silent_install_args   text,
    silent_uninstall_args text,
    product_code          text,
    detection_rule        jsonb,
    reboot_behaviour      text NOT NULL DEFAULT 'may-require' CHECK (reboot_behaviour IN ('none','may-require','always')),
    status                text NOT NULL DEFAULT 'pending_approval'
                          CHECK (status IN ('pending_approval','approved','rejected','superseded','retired')),
    supersedes_id         bigint REFERENCES ${schemaName}.discovery_software_package (id) ON DELETE SET NULL,
    approved_by           integer,
    approved_by_name      text,
    approved_at           timestamptz,
    rejected_reason       text,
    notes                 text,
    created_by            integer,
    created_by_name       text,
    created_at            timestamptz NOT NULL DEFAULT now(),
    updated_at            timestamptz NOT NULL DEFAULT now(),
    -- Phase 4: 'agent' marks the Asset Discovery Agent installer (MSI/EXE)
    -- used by the remote agent push; everything else is plain 'software'.
    kind                  text NOT NULL DEFAULT 'software'
);

-- Backfill for schemas onboarded before Phase 4 (CREATE TABLE IF NOT EXISTS
-- is a no-op on those, so the column + CHECK have to be added explicitly).
ALTER TABLE ${schemaName}.discovery_software_package
    ADD COLUMN IF NOT EXISTS kind text NOT NULL DEFAULT 'software';
ALTER TABLE ${schemaName}.discovery_software_package
    DROP CONSTRAINT IF EXISTS chk_discovery_software_package_kind;
ALTER TABLE ${schemaName}.discovery_software_package
    ADD CONSTRAINT chk_discovery_software_package_kind CHECK (kind IN ('software','agent'));

CREATE INDEX IF NOT EXISTS idx_discovery_software_package_name
    ON ${schemaName}.discovery_software_package (lower(name), version);
CREATE INDEX IF NOT EXISTS idx_discovery_software_package_status
    ON ${schemaName}.discovery_software_package (status);
CREATE INDEX IF NOT EXISTS idx_discovery_software_package_kind
    ON ${schemaName}.discovery_software_package (kind, status);

-- ========================= discovery_deployment =========================
-- Phase 3 (spec §3.6.3): software push — package, targets, reboot policy,
-- retries, rings (staged rollout).
CREATE TABLE IF NOT EXISTS ${schemaName}.discovery_deployment (
    id                bigserial PRIMARY KEY,
    name              text NOT NULL,
    package_id        bigint NOT NULL
                      REFERENCES ${schemaName}.discovery_software_package (id) ON DELETE RESTRICT,
    action            text NOT NULL DEFAULT 'install' CHECK (action IN ('install','uninstall')),
    target_selector   jsonb NOT NULL DEFAULT '{}'::jsonb,
    rings             jsonb NOT NULL DEFAULT '[]'::jsonb,
    ring_threshold    integer NOT NULL DEFAULT 100,
    current_ring      integer NOT NULL DEFAULT 0,
    reboot_policy     text NOT NULL DEFAULT 'never' CHECK (reboot_policy IN ('never','if-required','force')),
    retry_count       integer NOT NULL DEFAULT 1,
    status            text NOT NULL DEFAULT 'pending_approval'
                      CHECK (status IN ('pending_approval','approved','running','paused','completed','cancelled','rejected')),
    requested_by      integer,
    requested_by_name text,
    approved_by       integer,
    approved_by_name  text,
    approved_at       timestamptz,
    rejected_reason   text,
    started_at        timestamptz,
    finished_at       timestamptz,
    created_at        timestamptz NOT NULL DEFAULT now(),
    updated_at        timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_discovery_deployment_status
    ON ${schemaName}.discovery_deployment (status, created_at DESC);

-- ========================= discovery_deployment_device =========================
-- Phase 3: per-device status/exit code/install log for a deployment.
CREATE TABLE IF NOT EXISTS ${schemaName}.discovery_deployment_device (
    id              bigserial PRIMARY KEY,
    deployment_id   bigint NOT NULL
                    REFERENCES ${schemaName}.discovery_deployment (id) ON DELETE CASCADE,
    device_id       bigint NOT NULL
                    REFERENCES ${schemaName}.discovery_device (id) ON DELETE CASCADE,
    ring            integer NOT NULL DEFAULT 0,
    job_id          bigint,
    status          text NOT NULL DEFAULT 'pending'
                    CHECK (status IN ('pending','queued','downloading','installing','succeeded','failed','needs_reboot','skipped','cancelled')),
    attempts        integer NOT NULL DEFAULT 0,
    exit_code       integer,
    detected        boolean,
    install_log     text,
    error           text,
    started_at      timestamptz,
    finished_at     timestamptz,
    updated_at      timestamptz NOT NULL DEFAULT now(),
    UNIQUE (deployment_id, device_id)
);

CREATE INDEX IF NOT EXISTS idx_discovery_deployment_device_status
    ON ${schemaName}.discovery_deployment_device (deployment_id, status);

-- ========================= discovery_compliance_policy =========================
-- Phase 3 (spec §3.6.4): compliance policy engine — banned / required /
-- version floor / version ceiling rules with an optional remediation package.
CREATE TABLE IF NOT EXISTS ${schemaName}.discovery_compliance_policy (
    id                     bigserial PRIMARY KEY,
    name                   text NOT NULL,
    description            text,
    enabled                boolean NOT NULL DEFAULT true,
    scope_selector         jsonb NOT NULL DEFAULT '{}'::jsonb,
    rule_type              text NOT NULL CHECK (rule_type IN ('banned','required','version_floor','version_ceiling')),
    app_name_match         text NOT NULL,
    publisher_match        text,
    version_value          text,
    severity               text NOT NULL DEFAULT 'medium' CHECK (severity IN ('low','medium','high','critical')),
    remediation_action     text NOT NULL DEFAULT 'alert' CHECK (remediation_action IN ('none','alert','uninstall','install')),
    remediation_package_id bigint
                           REFERENCES ${schemaName}.discovery_software_package (id) ON DELETE SET NULL,
    requires_approval      boolean NOT NULL DEFAULT true,
    created_by             integer,
    created_by_name        text,
    created_at             timestamptz NOT NULL DEFAULT now(),
    updated_at             timestamptz NOT NULL DEFAULT now()
);

-- ========================= discovery_compliance_finding =========================
-- Phase 3: one row per (policy, device) violation, with waiver support.
CREATE TABLE IF NOT EXISTS ${schemaName}.discovery_compliance_finding (
    id                  bigserial PRIMARY KEY,
    policy_id           bigint NOT NULL
                        REFERENCES ${schemaName}.discovery_compliance_policy (id) ON DELETE CASCADE,
    device_id           bigint NOT NULL
                        REFERENCES ${schemaName}.discovery_device (id) ON DELETE CASCADE,
    software_name       text,
    detected_version    text,
    detail              text,
    status              text NOT NULL DEFAULT 'open'
                        CHECK (status IN ('open','approved','remediating','resolved','waived')),
    remediation_job_id  bigint,
    waiver_reason       text,
    waived_by           integer,
    waived_by_name      text,
    waived_until        timestamptz,
    first_detected      timestamptz NOT NULL DEFAULT now(),
    last_evaluated      timestamptz NOT NULL DEFAULT now(),
    resolved_at         timestamptz,
    UNIQUE (policy_id, device_id)
);

CREATE INDEX IF NOT EXISTS idx_discovery_compliance_finding_status
    ON ${schemaName}.discovery_compliance_finding (status, policy_id);
CREATE INDEX IF NOT EXISTS idx_discovery_compliance_finding_device
    ON ${schemaName}.discovery_compliance_finding (device_id);

-- ========================= discovery_protected_software =========================
-- Phase 3 (spec §3.6.5, spec §19 "do not remove business-critical software"):
-- deny-list for controlled uninstall.
CREATE TABLE IF NOT EXISTS ${schemaName}.discovery_protected_software (
    id              bigserial PRIMARY KEY,
    name_match      text NOT NULL,
    publisher_match text,
    reason          text,
    created_by      integer,
    created_at      timestamptz NOT NULL DEFAULT now()
);

-- Seed sensible defaults once (only when the table is empty) — same
-- singleton-seed pattern used for discovery_config above.
INSERT INTO ${schemaName}.discovery_protected_software (name_match, publisher_match, reason)
SELECT v.name_match, v.publisher_match, v.reason
FROM (VALUES
    ('Asset Discovery Agent%', NULL, 'The agent itself — removing it orphans the endpoint'),
    ('Microsoft Visual C++%Redistributable%', NULL, 'Shared runtime used by many applications'),
    ('Microsoft Edge%', 'Microsoft%', 'OS component'),
    ('Windows Defender%', 'Microsoft%', 'Security software'),
    ('%Antivirus%', NULL, 'Security software — remove only through the vendor console'),
    ('%Endpoint Protection%', NULL, 'Security software')
) AS v(name_match, publisher_match, reason)
WHERE NOT EXISTS (SELECT 1 FROM ${schemaName}.discovery_protected_software);

-- ========================= discovery_agent_push =========================
-- Phase 4 (slice 1): remote agent installation ("push"). One row per target PC
-- per push request: which relay agent does the work, which credential, which
-- package, the job, per-target status, exit code, log tail, and the new agent
-- id once the target registers. Uses the existing "Agents > EDIT" permission,
-- so no RBAC change.
CREATE TABLE IF NOT EXISTS ${schemaName}.discovery_agent_push (
    id                 bigserial PRIMARY KEY,
    -- hostname / FQDN / IP typed or picked
    target             text NOT NULL,
    -- normalised short host name (for matching the new agent)
    target_hostname    text,
    device_id          bigint
                       REFERENCES ${schemaName}.discovery_device (id) ON DELETE SET NULL,
    -- discovery_ad_computer.id when picked from AD (no FK: AD rows are re-synced)
    ad_computer_id     bigint,
    relay_agent_id     bigint NOT NULL
                       REFERENCES ${schemaName}.discovery_agent (id) ON DELETE RESTRICT,
    relay_hostname     text,
    -- discovery_credential.id (no FK: credential may be deleted later; name kept)
    credential_id      bigint,
    credential_name    text,
    package_id         bigint
                       REFERENCES ${schemaName}.discovery_software_package (id) ON DELETE RESTRICT,
    package_version    text,
    -- discovery_remote_job.id (AGENT_PUSH_INSTALL)
    job_id             bigint,
    status             text NOT NULL DEFAULT 'pending_approval'
                       CHECK (status IN ('pending_approval','queued','running','installed','registered','already_installed','failed','cancelled')),
    -- 'wmi' (DCOM + ADMIN$) — reported by the relay agent
    method             text,
    exit_code          integer,
    log                text,
    error              text,
    new_agent_id       bigint
                       REFERENCES ${schemaName}.discovery_agent (id) ON DELETE SET NULL,
    requested_by       integer,
    requested_by_name  text,
    created_at         timestamptz NOT NULL DEFAULT now(),
    updated_at         timestamptz NOT NULL DEFAULT now(),
    finished_at        timestamptz
);

CREATE INDEX IF NOT EXISTS idx_discovery_agent_push_status
    ON ${schemaName}.discovery_agent_push (status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_discovery_agent_push_host
    ON ${schemaName}.discovery_agent_push (lower(target_hostname));
CREATE INDEX IF NOT EXISTS idx_discovery_agent_push_job
    ON ${schemaName}.discovery_agent_push (job_id);
`;
        try {
            await this.dataSource.query(query);
            console.log(`✅ Discovery tables created for ${schemaName}`);
        }
        catch (err) {
            console.error(`❌ Error creating discovery tables for ${schemaName}:`, err);
            throw err;
        }
    }
};
exports.DiscoveryTablesScript = DiscoveryTablesScript;
exports.DiscoveryTablesScript = DiscoveryTablesScript = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectDataSource)()),
    __metadata("design:paramtypes", [typeorm_2.DataSource])
], DiscoveryTablesScript);
