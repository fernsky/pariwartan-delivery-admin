-- Check if acme_ward_wise_household_roof table exists, if not create it
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_tables WHERE tablename = 'acme_ward_wise_household_roof'
    ) THEN
        CREATE TABLE acme_ward_wise_household_roof (
            id VARCHAR(36) PRIMARY KEY,
            ward_number INTEGER NOT NULL,
            roof_type VARCHAR(100) NOT NULL,
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
    IF NOT EXISTS (SELECT 1 FROM acme_ward_wise_household_roof) THEN
        INSERT INTO acme_ward_wise_household_roof (
            id, ward_number, roof_type, households
        )
        VALUES
        -- Ward 1: सिमेन्ट/ ढलान=4, जस्ता/टिन=367, टायल=0, खर/पराल/ छ्वाली=85, काठ/फल्याक=11, ढुङ्गा/स्लेट=207, अन्य=1
        (gen_random_uuid(), 1, 'CEMENT', 4),
        (gen_random_uuid(), 1, 'TIN', 367),
        (gen_random_uuid(), 1, 'TILE', 0),
        (gen_random_uuid(), 1, 'STRAW', 85),
        (gen_random_uuid(), 1, 'WOOD', 11),
        (gen_random_uuid(), 1, 'STONE', 207),
        (gen_random_uuid(), 1, 'OTHER', 1),
        -- Ward 2: सिमेन्ट/ ढलान=3, जस्ता/टिन=400, टायल=3, खर/पराल/ छ्वाली=65, काठ/फल्याक=2, ढुङ्गा/स्लेट=623, अन्य=0
        (gen_random_uuid(), 2, 'CEMENT', 3),
        (gen_random_uuid(), 2, 'TIN', 400),
        (gen_random_uuid(), 2, 'TILE', 3),
        (gen_random_uuid(), 2, 'STRAW', 65),
        (gen_random_uuid(), 2, 'WOOD', 2),
        (gen_random_uuid(), 2, 'STONE', 623),
        (gen_random_uuid(), 2, 'OTHER', 0),
        -- Ward 3: सिमेन्ट/ ढलान=28, जस्ता/टिन=147, टायल=1, खर/पराल/ छ्वाली=26, काठ/फल्याक=0, ढुङ्गा/स्लेट=542, अन्य=3
        (gen_random_uuid(), 3, 'CEMENT', 28),
        (gen_random_uuid(), 3, 'TIN', 147),
        (gen_random_uuid(), 3, 'TILE', 1),
        (gen_random_uuid(), 3, 'STRAW', 26),
        (gen_random_uuid(), 3, 'WOOD', 0),
        (gen_random_uuid(), 3, 'STONE', 542),
        (gen_random_uuid(), 3, 'OTHER', 3),
        -- Ward 4: सिमेन्ट/ ढलान=3, जस्ता/टिन=374, टायल=1, खर/पराल/ छ्वाली=105, काठ/फल्याक=0, ढुङ्गा/स्लेट=396, अन्य=0
        (gen_random_uuid(), 4, 'CEMENT', 3),
        (gen_random_uuid(), 4, 'TIN', 374),
        (gen_random_uuid(), 4, 'TILE', 1),
        (gen_random_uuid(), 4, 'STRAW', 105),
        (gen_random_uuid(), 4, 'WOOD', 0),
        (gen_random_uuid(), 4, 'STONE', 396),
        (gen_random_uuid(), 4, 'OTHER', 0),
        -- Ward 5: सिमेन्ट/ ढलान=20, जस्ता/टिन=310, टायल=0, खर/पराल/ छ्वाली=56, काठ/फल्याक=7, ढुङ्गा/स्लेट=425, अन्य=0
        (gen_random_uuid(), 5, 'CEMENT', 20),
        (gen_random_uuid(), 5, 'TIN', 310),
        (gen_random_uuid(), 5, 'TILE', 0),
        (gen_random_uuid(), 5, 'STRAW', 56),
        (gen_random_uuid(), 5, 'WOOD', 7),
        (gen_random_uuid(), 5, 'STONE', 425),
        (gen_random_uuid(), 5, 'OTHER', 0),
        -- Ward 6: सिमेन्ट/ ढलान=7, जस्ता/टिन=54, टायल=0, खर/पराल/ छ्वाली=10, काठ/फल्याक=0, ढुङ्गा/स्लेट=396, अन्य=0
        (gen_random_uuid(), 6, 'CEMENT', 7),
        (gen_random_uuid(), 6, 'TIN', 54),
        (gen_random_uuid(), 6, 'TILE', 0),
        (gen_random_uuid(), 6, 'STRAW', 10),
        (gen_random_uuid(), 6, 'WOOD', 0),
        (gen_random_uuid(), 6, 'STONE', 396),
        (gen_random_uuid(), 6, 'OTHER', 0);
    END IF;
END
$$;