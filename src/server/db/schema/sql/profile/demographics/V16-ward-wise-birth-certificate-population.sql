-- Check if acme_ward_wise_birth_certificate_population table exists, if not create it
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_tables WHERE tablename = 'acme_ward_wise_birth_certificate_population'
    ) THEN
        CREATE TABLE acme_ward_wise_birth_certificate_population (
            id VARCHAR(36) PRIMARY KEY,
            ward_number INTEGER NOT NULL,
            with_birth_certificate INTEGER NOT NULL CHECK (with_birth_certificate >= 0),
            without_birth_certificate INTEGER NOT NULL CHECK (without_birth_certificate >= 0),
            total_population_under_5 INTEGER GENERATED ALWAYS AS (with_birth_certificate + without_birth_certificate) STORED,
            updated_at TIMESTAMP DEFAULT NOW(),
            created_at TIMESTAMP DEFAULT NOW()
        );
    END IF;
END
$$;

-- Insert updated seed data if table is empty
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM acme_ward_wise_birth_certificate_population) THEN
        INSERT INTO acme_ward_wise_birth_certificate_population (
            id, ward_number, with_birth_certificate, without_birth_certificate
        )
        VALUES
        (gen_random_uuid(), 1, 341, 23),
        (gen_random_uuid(), 2, 548, 67),
        (gen_random_uuid(), 3, 382, 64),
        (gen_random_uuid(), 4, 280, 85),
        (gen_random_uuid(), 5, 435, 43),
        (gen_random_uuid(), 6, 183, 341);
    END IF;
END
$$;
        (gen_random_uuid(), 5, 202, 233, 22, 21),
        (gen_random_uuid(), 6, 96, 87, 191, 150);
    END IF;
END
$$;
