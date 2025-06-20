-- Check if acme_ward_wise_toilet_type table exists, if not create it
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_tables WHERE tablename = 'acme_ward_wise_toilet_type'
    ) THEN
        CREATE TABLE acme_ward_wise_toilet_type (
            id VARCHAR(36) PRIMARY KEY,
            ward_number INTEGER NOT NULL,
            toilet_type VARCHAR(100) NOT NULL,
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
    IF NOT EXISTS (SELECT 1 FROM acme_ward_wise_toilet_type) THEN
        INSERT INTO acme_ward_wise_toilet_type (
            id, ward_number, toilet_type, households
        )
        VALUES
        -- Ward 1
        (gen_random_uuid(), 1, 'NORMAL', 10),
        (gen_random_uuid(), 1, 'FLUSH_WITH_SEPTIC_TANK', 627),
        (gen_random_uuid(), 1, 'PUBLIC_EILANI', 5),
        (gen_random_uuid(), 1, 'NO_TOILET', 8),
        (gen_random_uuid(), 1, 'OTHER', 25),

        -- Ward 2
        (gen_random_uuid(), 2, 'NORMAL', 203),
        (gen_random_uuid(), 2, 'FLUSH_WITH_SEPTIC_TANK', 715),
        (gen_random_uuid(), 2, 'PUBLIC_EILANI', 2),
        (gen_random_uuid(), 2, 'NO_TOILET', 0),
        (gen_random_uuid(), 2, 'OTHER', 176),

        -- Ward 3
        (gen_random_uuid(), 3, 'NORMAL', 79),
        (gen_random_uuid(), 3, 'FLUSH_WITH_SEPTIC_TANK', 660),
        (gen_random_uuid(), 3, 'PUBLIC_EILANI', 0),
        (gen_random_uuid(), 3, 'NO_TOILET', 2),
        (gen_random_uuid(), 3, 'OTHER', 6),

        -- Ward 4
        (gen_random_uuid(), 4, 'NORMAL', 434),
        (gen_random_uuid(), 4, 'FLUSH_WITH_SEPTIC_TANK', 437),
        (gen_random_uuid(), 4, 'PUBLIC_EILANI', 2),
        (gen_random_uuid(), 4, 'NO_TOILET', 3),
        (gen_random_uuid(), 4, 'OTHER', 3),

        -- Ward 5
        (gen_random_uuid(), 5, 'NORMAL', 6),
        (gen_random_uuid(), 5, 'FLUSH_WITH_SEPTIC_TANK', 784),
        (gen_random_uuid(), 5, 'PUBLIC_EILANI', 0),
        (gen_random_uuid(), 5, 'NO_TOILET', 1),
        (gen_random_uuid(), 5, 'OTHER', 27),

        -- Ward 6
        (gen_random_uuid(), 6, 'NORMAL', 4),
        (gen_random_uuid(), 6, 'FLUSH_WITH_SEPTIC_TANK', 447),
        (gen_random_uuid(), 6, 'PUBLIC_EILANI', 0),
        (gen_random_uuid(), 6, 'NO_TOILET', 3),
        (gen_random_uuid(), 6, 'OTHER', 13);
    END IF;
END
$$;