-- Check if municipality_facilities table exists, if not create it
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_tables WHERE tablename = 'acme_municipality_facilities'
    ) THEN
        CREATE TABLE acme_municipality_facilities (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            facility facility_type NOT NULL UNIQUE,
            population INTEGER NOT NULL,
            updated_at TIMESTAMP DEFAULT NOW(),
            created_at TIMESTAMP DEFAULT NOW()
        );
    END IF;
END
$$;

-- Insert seed data if table is empty
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM acme_municipality_facilities) THEN
        INSERT INTO acme_municipality_facilities (id, facility, population) VALUES
        (gen_random_uuid(), 'MOBILE_PHONE', 8388),
        (gen_random_uuid(), 'ELECTRICAL_FAN', 7461),
        (gen_random_uuid(), 'BICYCLE', 7101),
        (gen_random_uuid(), 'TELEVISION', 4497),
        (gen_random_uuid(), 'INTERNET', 3781),
        (gen_random_uuid(), 'REFRIGERATOR', 3063),
        (gen_random_uuid(), 'MOTORCYCLE', 2469),
        (gen_random_uuid(), 'RADIO', 1016),
        (gen_random_uuid(), 'COMPUTER', 562),
        (gen_random_uuid(), 'WASHING_MACHINE', 119),
        (gen_random_uuid(), 'CAR_JEEP', 76),
        (gen_random_uuid(), 'AIR_CONDITIONER', 55),
        (gen_random_uuid(), 'NONE', 222),
        (gen_random_uuid(), 'MICROWAVE_OVEN', 13),
        (gen_random_uuid(), 'DAILY_NATIONAL_NEWSPAPER_ACCESS', 15);
    END IF;
END
$$;