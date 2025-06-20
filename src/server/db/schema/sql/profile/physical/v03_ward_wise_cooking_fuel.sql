-- Check if acme_ward_wise_cooking_fuel table exists, if not create it
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_tables WHERE tablename = 'acme_ward_wise_cooking_fuel'
    ) THEN
        CREATE TABLE acme_ward_wise_cooking_fuel (
            id VARCHAR(36) PRIMARY KEY,
            ward_number INTEGER NOT NULL,
            cooking_fuel VARCHAR(100) NOT NULL,
            households INTEGER NOT NULL,
            updated_at TIMESTAMP DEFAULT NOW(),
            created_at TIMESTAMP DEFAULT NOW()
        );
    END IF;
END
$$;

-- Insert seed data if table is empty
-- Insert ward-wise cooking fuel data
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM acme_ward_wise_cooking_fuel) THEN
        INSERT INTO acme_ward_wise_cooking_fuel (
            id, ward_number, cooking_fuel, households
        )
        VALUES
        -- Ward 1
        (gen_random_uuid(), 1, 'WOOD', 621),
        (gen_random_uuid(), 1, 'LP_GAS', 41),
        (gen_random_uuid(), 1, 'KEROSENE', 12),
        (gen_random_uuid(), 1, 'BIOGAS', 0),
        (gen_random_uuid(), 1, 'OTHER', 1),
        -- Ward 2
        (gen_random_uuid(), 2, 'WOOD', 1057),
        (gen_random_uuid(), 2, 'LP_GAS', 34),
        (gen_random_uuid(), 2, 'KEROSENE', 0),
        (gen_random_uuid(), 2, 'BIOGAS', 3),
        (gen_random_uuid(), 2, 'OTHER', 2),
        -- Ward 3
        (gen_random_uuid(), 3, 'WOOD', 693),
        (gen_random_uuid(), 3, 'LP_GAS', 0),
        (gen_random_uuid(), 3, 'KEROSENE', 1),
        (gen_random_uuid(), 3, 'BIOGAS', 52),
        (gen_random_uuid(), 3, 'OTHER', 1),
        -- Ward 4
        (gen_random_uuid(), 4, 'WOOD', 879),
        (gen_random_uuid(), 4, 'LP_GAS', 0),
        (gen_random_uuid(), 4, 'KEROSENE', 0),
        (gen_random_uuid(), 4, 'BIOGAS', 0),
        (gen_random_uuid(), 4, 'OTHER', 0),
        -- Ward 5
        (gen_random_uuid(), 5, 'WOOD', 760),
        (gen_random_uuid(), 5, 'LP_GAS', 51),
        (gen_random_uuid(), 5, 'KEROSENE', 3),
        (gen_random_uuid(), 5, 'BIOGAS', 4),
        (gen_random_uuid(), 5, 'OTHER', 0),
        -- Ward 6
        (gen_random_uuid(), 6, 'WOOD', 452),
        (gen_random_uuid(), 6, 'LP_GAS', 14),
        (gen_random_uuid(), 6, 'KEROSENE', 0),
        (gen_random_uuid(), 6, 'BIOGAS', 1),
        (gen_random_uuid(), 6, 'OTHER', 0);
    END IF;
END
$$;