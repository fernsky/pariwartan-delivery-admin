-- Check if ward_wise_household_base table exists, if not create it
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_tables WHERE tablename = 'ward_wise_household_base'
    ) THEN
        CREATE TABLE acme_ward_wise_household_base (
            id VARCHAR(36) PRIMARY KEY,
            ward_number INTEGER NOT NULL,
            base_type VARCHAR(100) NOT NULL,
            households INTEGER NOT NULL,
            updated_at TIMESTAMP DEFAULT NOW(),
            created_at TIMESTAMP DEFAULT NOW()
        );
    END IF;
END
$$;

-- Insert seed data if table is empty using the accurate real data
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM acme_ward_wise_household_base) THEN
        INSERT INTO acme_ward_wise_household_base (
            id, ward_number, base_type, households
        )
        VALUES
        -- Ward 1
        (gen_random_uuid(), 1, 'MUD_JOINED_BRICK_STONE', 653),
        (gen_random_uuid(), 1, 'CEMENT_JOINED_BRICK_STONE', 6),
        (gen_random_uuid(), 1, 'RCC_PILLAR', 0),
        (gen_random_uuid(), 1, 'WOOD_POLE', 2),
        (gen_random_uuid(), 1, 'OTHER', 14),
        
        -- Ward 2
        (gen_random_uuid(), 2, 'MUD_JOINED_BRICK_STONE', 1087),
        (gen_random_uuid(), 2, 'CEMENT_JOINED_BRICK_STONE', 7),
        (gen_random_uuid(), 2, 'RCC_PILLAR', 1),
        (gen_random_uuid(), 2, 'WOOD_POLE', 1),
        (gen_random_uuid(), 2, 'OTHER', 0),
        
        -- Ward 3
        (gen_random_uuid(), 3, 'MUD_JOINED_BRICK_STONE', 706),
        (gen_random_uuid(), 3, 'CEMENT_JOINED_BRICK_STONE', 35),
        (gen_random_uuid(), 3, 'RCC_PILLAR', 3),
        (gen_random_uuid(), 3, 'WOOD_POLE', 1),
        (gen_random_uuid(), 3, 'OTHER', 2),
        
        -- Ward 4
        (gen_random_uuid(), 4, 'MUD_JOINED_BRICK_STONE', 874),
        (gen_random_uuid(), 4, 'CEMENT_JOINED_BRICK_STONE', 3),
        (gen_random_uuid(), 4, 'RCC_PILLAR', 1),
        (gen_random_uuid(), 4, 'WOOD_POLE', 1),
        (gen_random_uuid(), 4, 'OTHER', 0),
        
        -- Ward 5
        (gen_random_uuid(), 5, 'MUD_JOINED_BRICK_STONE', 801),
        (gen_random_uuid(), 5, 'CEMENT_JOINED_BRICK_STONE', 16),
        (gen_random_uuid(), 5, 'RCC_PILLAR', 1),
        (gen_random_uuid(), 5, 'WOOD_POLE', 0),
        (gen_random_uuid(), 5, 'OTHER', 0),
        
        -- Ward 6
        (gen_random_uuid(), 6, 'MUD_JOINED_BRICK_STONE', 458),
        (gen_random_uuid(), 6, 'CEMENT_JOINED_BRICK_STONE', 6),
        (gen_random_uuid(), 6, 'RCC_PILLAR', 0),
        (gen_random_uuid(), 6, 'WOOD_POLE', 3),
        (gen_random_uuid(), 6, 'OTHER', 0);
    END IF;
END
$$;