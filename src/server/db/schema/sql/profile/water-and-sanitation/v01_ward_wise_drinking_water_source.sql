-- Check if acme_ward_wise_drinking_water_source table exists, if not create it
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_tables WHERE tablename = 'acme_ward_wise_drinking_water_source'
    ) THEN
        CREATE TABLE acme_ward_wise_drinking_water_source (
            id VARCHAR(36) PRIMARY KEY,
            ward_number INTEGER NOT NULL,
            drinking_water_source VARCHAR(100) NOT NULL,
            households INTEGER NOT NULL,
            updated_at TIMESTAMP DEFAULT NOW(),
            created_at TIMESTAMP DEFAULT NOW()
        );
    END IF;
END
$$;

-- Insert seed data if table is empty
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM acme_ward_wise_drinking_water_source) THEN
        INSERT INTO acme_ward_wise_drinking_water_source (
            id, ward_number, drinking_water_source, households
        )
        VALUES
        -- Ward 1
        (gen_random_uuid(), 1, 'AQUIFIER_MOOL', 400),
        (gen_random_uuid(), 1, 'TAP_INSIDE_HOUSE', 76),
        (gen_random_uuid(), 1, 'TAP_OUTSIDE_HOUSE', 164),
        (gen_random_uuid(), 1, 'COVERED_WELL', 0),
        (gen_random_uuid(), 1, 'OPEN_WELL', 7),
        (gen_random_uuid(), 1, 'RIVER', 26),
        (gen_random_uuid(), 1, 'OTHER', 2),

        -- Ward 2
        (gen_random_uuid(), 2, 'AQUIFIER_MOOL', 136),
        (gen_random_uuid(), 2, 'TAP_INSIDE_HOUSE', 482),
        (gen_random_uuid(), 2, 'TAP_OUTSIDE_HOUSE', 465),
        (gen_random_uuid(), 2, 'COVERED_WELL', 0),
        (gen_random_uuid(), 2, 'OPEN_WELL', 9),
        (gen_random_uuid(), 2, 'RIVER', 3),
        (gen_random_uuid(), 2, 'OTHER', 1),

        -- Ward 3
        (gen_random_uuid(), 3, 'AQUIFIER_MOOL', 646),
        (gen_random_uuid(), 3, 'TAP_INSIDE_HOUSE', 25),
        (gen_random_uuid(), 3, 'TAP_OUTSIDE_HOUSE', 75),
        (gen_random_uuid(), 3, 'COVERED_WELL', 0),
        (gen_random_uuid(), 3, 'OPEN_WELL', 0),
        (gen_random_uuid(), 3, 'RIVER', 0),
        (gen_random_uuid(), 3, 'OTHER', 1),

        -- Ward 4
        (gen_random_uuid(), 4, 'AQUIFIER_MOOL', 15),
        (gen_random_uuid(), 4, 'TAP_INSIDE_HOUSE', 340),
        (gen_random_uuid(), 4, 'TAP_OUTSIDE_HOUSE', 518),
        (gen_random_uuid(), 4, 'COVERED_WELL', 1),
        (gen_random_uuid(), 4, 'OPEN_WELL', 1),
        (gen_random_uuid(), 4, 'RIVER', 4),
        (gen_random_uuid(), 4, 'OTHER', 0),

        -- Ward 5
        (gen_random_uuid(), 5, 'AQUIFIER_MOOL', 179),
        (gen_random_uuid(), 5, 'TAP_INSIDE_HOUSE', 101),
        (gen_random_uuid(), 5, 'TAP_OUTSIDE_HOUSE', 534),
        (gen_random_uuid(), 5, 'COVERED_WELL', 0),
        (gen_random_uuid(), 5, 'OPEN_WELL', 2),
        (gen_random_uuid(), 5, 'RIVER', 1),
        (gen_random_uuid(), 5, 'OTHER', 1),

        -- Ward 6
        (gen_random_uuid(), 6, 'AQUIFIER_MOOL', 99),
        (gen_random_uuid(), 6, 'TAP_INSIDE_HOUSE', 12),
        (gen_random_uuid(), 6, 'TAP_OUTSIDE_HOUSE', 304),
        (gen_random_uuid(), 6, 'COVERED_WELL', 0),
        (gen_random_uuid(), 6, 'OPEN_WELL', 49),
        (gen_random_uuid(), 6, 'RIVER', 3),
        (gen_random_uuid(), 6, 'OTHER', 0);
    END IF;
END
$$;