-- Check if acme_ward_wise_house_ownership table exists, if not create it
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_tables WHERE tablename = 'acme_ward_wise_house_ownership'
    ) THEN
        -- Create ownership type enum if it doesn't exist
        IF NOT EXISTS (
            SELECT 1 FROM pg_type WHERE typname = 'ownership_type_enum'
        ) THEN
            CREATE TYPE ownership_type_enum AS ENUM ('PRIVATE', 'RENT', 'INSTITUTIONAL', 'OTHER');
        END IF;

        CREATE TABLE acme_ward_wise_house_ownership (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            ward_number INTEGER NOT NULL,
            ownership_type ownership_type_enum NOT NULL,
            households INTEGER NOT NULL DEFAULT 0 CHECK (households >= 0),
            updated_at TIMESTAMP DEFAULT NOW(),
            created_at TIMESTAMP DEFAULT NOW()
        );
    END IF;
END
$$;

-- Insert seed data if table is empty
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM acme_ward_wise_house_ownership) THEN
        -- Ward data based on provided JSON
        INSERT INTO acme_ward_wise_house_ownership (ward_number, ownership_type, households) VALUES
        -- Ward 1
        (1, 'PRIVATE', 637), (1, 'RENT', 19), (1, 'INSTITUTIONAL', 1), (1, 'OTHER', 18),
        -- Ward 2
        (2, 'PRIVATE', 1055), (2, 'RENT', 35), (2, 'INSTITUTIONAL', 6), (2, 'OTHER', 0),
        -- Ward 3
        (3, 'PRIVATE', 685), (3, 'RENT', 58), (3, 'INSTITUTIONAL', 2), (3, 'OTHER', 2),
        -- Ward 4
        (4, 'PRIVATE', 873), (4, 'RENT', 4), (4, 'INSTITUTIONAL', 1), (4, 'OTHER', 1),
        -- Ward 5
        (5, 'PRIVATE', 801), (5, 'RENT', 14), (5, 'INSTITUTIONAL', 2), (5, 'OTHER', 1),
        -- Ward 6
        (6, 'PRIVATE', 449), (6, 'RENT', 18), (6, 'INSTITUTIONAL', 0), (6, 'OTHER', 0);

        -- Add indexes
        CREATE INDEX IF NOT EXISTS idx_ward_wise_house_ownership_ward_number ON acme_ward_wise_house_ownership(ward_number);
        CREATE INDEX IF NOT EXISTS idx_ward_wise_house_ownership_type ON acme_ward_wise_house_ownership(ownership_type);
    END IF;
END
$$;

-- Add comments for documentation
COMMENT ON TABLE acme_ward_wise_house_ownership IS 'Stores ward-wise house ownership data (घरको स्वामित्वको आधारमा घरपरिवारको विवरण)';
COMMENT ON COLUMN acme_ward_wise_house_ownership.ward_number IS 'Ward number (1-6)';
COMMENT ON COLUMN acme_ward_wise_house_ownership.ownership_type IS 'Type of house ownership (निजी=PRIVATE, भाडामा=RENT, संस्थागत=INSTITUTIONAL, अन्य=OTHER)';
COMMENT ON COLUMN acme_ward_wise_house_ownership.households IS 'Number of households with this type of ownership in the ward';
COMMENT ON COLUMN acme_ward_wise_house_ownership.ward_number IS 'Ward number (1-8)';
COMMENT ON COLUMN acme_ward_wise_house_ownership.ownership_type IS 'Type of house ownership (PRIVATE, RENT, INSTITUTIONAL, OTHER)';
COMMENT ON COLUMN acme_ward_wise_house_ownership.households IS 'Number of households with this type of ownership in the ward';
