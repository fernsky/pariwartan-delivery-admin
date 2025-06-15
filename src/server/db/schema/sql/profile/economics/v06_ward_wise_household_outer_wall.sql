-- Drop existing table and enum to recreate with correct structure
DROP TABLE IF EXISTS acme_ward_wise_household_outer_wall CASCADE;
DROP TYPE IF EXISTS outer_wall_type CASCADE;

-- Create the enum type with correct values
CREATE TYPE outer_wall_type AS ENUM (
    'MUD_JOINED_BRICK_STONE',
    'CEMENT_BRICK_JOINED',
    'WOOD',
    'BAMBOO',
    'UNBAKED_BRICK',
    'TIN',
    'OTHER'
);

-- Create table
CREATE TABLE acme_ward_wise_household_outer_wall (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ward_number INTEGER NOT NULL,
    wall_type outer_wall_type NOT NULL,
    households INTEGER NOT NULL,
    updated_at TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Insert seed data
INSERT INTO acme_ward_wise_household_outer_wall (
    id, ward_number, wall_type, households
)
VALUES
-- Ward 1
(gen_random_uuid(), 1, 'MUD_JOINED_BRICK_STONE', 654),
(gen_random_uuid(), 1, 'CEMENT_BRICK_JOINED', 2),
(gen_random_uuid(), 1, 'WOOD', 0),
(gen_random_uuid(), 1, 'BAMBOO', 1),
(gen_random_uuid(), 1, 'UNBAKED_BRICK', 4),
(gen_random_uuid(), 1, 'TIN', 14),
(gen_random_uuid(), 1, 'OTHER', 0),

-- Ward 2
(gen_random_uuid(), 2, 'MUD_JOINED_BRICK_STONE', 1089),
(gen_random_uuid(), 2, 'CEMENT_BRICK_JOINED', 1),
(gen_random_uuid(), 2, 'WOOD', 1),
(gen_random_uuid(), 2, 'BAMBOO', 0),
(gen_random_uuid(), 2, 'UNBAKED_BRICK', 3),
(gen_random_uuid(), 2, 'TIN', 2),
(gen_random_uuid(), 2, 'OTHER', 0),

-- Ward 3
(gen_random_uuid(), 3, 'MUD_JOINED_BRICK_STONE', 707),
(gen_random_uuid(), 3, 'CEMENT_BRICK_JOINED', 36),
(gen_random_uuid(), 3, 'WOOD', 0),
(gen_random_uuid(), 3, 'BAMBOO', 1),
(gen_random_uuid(), 3, 'UNBAKED_BRICK', 0),
(gen_random_uuid(), 3, 'TIN', 1),
(gen_random_uuid(), 3, 'OTHER', 2),

-- Ward 4
(gen_random_uuid(), 4, 'MUD_JOINED_BRICK_STONE', 874),
(gen_random_uuid(), 4, 'CEMENT_BRICK_JOINED', 3),
(gen_random_uuid(), 4, 'WOOD', 1),
(gen_random_uuid(), 4, 'BAMBOO', 0),
(gen_random_uuid(), 4, 'UNBAKED_BRICK', 1),
(gen_random_uuid(), 4, 'TIN', 0),
(gen_random_uuid(), 4, 'OTHER', 0),

-- Ward 5
(gen_random_uuid(), 5, 'MUD_JOINED_BRICK_STONE', 795),
(gen_random_uuid(), 5, 'CEMENT_BRICK_JOINED', 17),
(gen_random_uuid(), 5, 'WOOD', 3),
(gen_random_uuid(), 5, 'BAMBOO', 0),
(gen_random_uuid(), 5, 'UNBAKED_BRICK', 3),
(gen_random_uuid(), 5, 'TIN', 0),
(gen_random_uuid(), 5, 'OTHER', 0),

-- Ward 6
(gen_random_uuid(), 6, 'MUD_JOINED_BRICK_STONE', 451),
(gen_random_uuid(), 6, 'CEMENT_BRICK_JOINED', 7),
(gen_random_uuid(), 6, 'WOOD', 7),
(gen_random_uuid(), 6, 'BAMBOO', 1),
(gen_random_uuid(), 6, 'UNBAKED_BRICK', 0),
(gen_random_uuid(), 6, 'TIN', 1),
(gen_random_uuid(), 6, 'OTHER', 0);
    
END IF;
END
$$;

