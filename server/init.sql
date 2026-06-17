CREATE SCHEMA IF NOT EXISTS "public";

CREATE TABLE "public"."Agents" (
    "uid" uuid NOT NULL,
    "host" text,
    "port" integer,
    "agents_location" text,
    CONSTRAINT "pk_table_1_id" PRIMARY KEY ("uid")
);

CREATE TABLE "public"."Tasks" (
    "id" bigint NOT NULL,
    "host_to_check" bigint,
    "check_type" json,
    "agents_location" text,
    CONSTRAINT "pk_table_2_id" PRIMARY KEY ("id")
);

CREATE TABLE "public"."MainServer" (
    "id" bigint NOT NULL,
    "agent_port" integer,
    "agent_host" text,
    CONSTRAINT "pk_table_3_id" PRIMARY KEY ("id")
);

-- Foreign key constraints
-- Schema: public
ALTER TABLE "public"."Agents" ADD CONSTRAINT "fk_Agents_agents_location_Tasks_agents_location" FOREIGN KEY("agents_location") REFERENCES "public"."Tasks"("agents_location");
ALTER TABLE "public"."Agents" ADD CONSTRAINT "fk_Agents_host_MainServer_agent_host" FOREIGN KEY("host") REFERENCES "public"."MainServer"("agent_host");
ALTER TABLE "public"."Agents" ADD CONSTRAINT "fk_Agents_port_MainServer_agent_port" FOREIGN KEY("port") REFERENCES "public"."MainServer"("agent_port");