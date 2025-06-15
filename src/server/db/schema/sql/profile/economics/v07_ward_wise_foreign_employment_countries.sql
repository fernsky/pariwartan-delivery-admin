-- Check if ward_wise_foreign_employment_countries table exists, if not create it
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_tables WHERE tablename = 'ward_wise_foreign_employment_countries'
    ) THEN
        CREATE TABLE acme_ward_wise_foreign_employment_countries (
            id VARCHAR(36) PRIMARY KEY,
            age_group VARCHAR(50) NOT NULL,
            gender VARCHAR(20) NOT NULL,
            country VARCHAR(50) NOT NULL,
            population INTEGER NOT NULL,
            total INTEGER NOT NULL,
            updated_at TIMESTAMP DEFAULT NOW(),
            created_at TIMESTAMP DEFAULT NOW()
        );
    END IF;
END
$$;

-- Delete existing data to ensure clean insertion
DO $$
BEGIN
    DELETE FROM acme_ward_wise_foreign_employment_countries;
END
$$;

-- Insert real data from the provided JSON
DO $$
BEGIN
    -- 0-14 years data
    INSERT INTO acme_ward_wise_foreign_employment_countries (id, age_group, gender, country, population, total)
    VALUES
        (gen_random_uuid(), '0-14', 'MALE', 'INDIA', 72, 81),
        (gen_random_uuid(), '0-14', 'MALE', 'SAARC', 0, 81),
        (gen_random_uuid(), '0-14', 'MALE', 'ASIAN', 1, 81),
        (gen_random_uuid(), '0-14', 'MALE', 'MIDDLE_EAST', 6, 81),
        (gen_random_uuid(), '0-14', 'MALE', 'OTHER_ASIAN', 0, 81),
        (gen_random_uuid(), '0-14', 'MALE', 'EUROPE', 0, 81),
        (gen_random_uuid(), '0-14', 'MALE', 'OTHER_EUROPE', 0, 81),
        (gen_random_uuid(), '0-14', 'MALE', 'NORTH_AMERICA', 2, 81),
        (gen_random_uuid(), '0-14', 'MALE', 'AFRICA', 0, 81),
        (gen_random_uuid(), '0-14', 'MALE', 'PACIFIC', 0, 81),
        (gen_random_uuid(), '0-14', 'MALE', 'OTHER', 0, 81),
        (gen_random_uuid(), '0-14', 'MALE', 'NOT_DISCLOSED', 0, 81),

        (gen_random_uuid(), '0-14', 'FEMALE', 'INDIA', 67, 74),
        (gen_random_uuid(), '0-14', 'FEMALE', 'SAARC', 0, 74),
        (gen_random_uuid(), '0-14', 'FEMALE', 'ASIAN', 0, 74),
        (gen_random_uuid(), '0-14', 'FEMALE', 'MIDDLE_EAST', 2, 74),
        (gen_random_uuid(), '0-14', 'FEMALE', 'OTHER_ASIAN', 0, 74),
        (gen_random_uuid(), '0-14', 'FEMALE', 'EUROPE', 0, 74),
        (gen_random_uuid(), '0-14', 'FEMALE', 'OTHER_EUROPE', 0, 74),
        (gen_random_uuid(), '0-14', 'FEMALE', 'NORTH_AMERICA', 4, 74),
        (gen_random_uuid(), '0-14', 'FEMALE', 'AFRICA', 0, 74),
        (gen_random_uuid(), '0-14', 'FEMALE', 'PACIFIC', 1, 74),
        (gen_random_uuid(), '0-14', 'FEMALE', 'OTHER', 0, 74),
        (gen_random_uuid(), '0-14', 'FEMALE', 'NOT_DISCLOSED', 0, 74),

        (gen_random_uuid(), '0-14', 'TOTAL', 'INDIA', 139, 155),
        (gen_random_uuid(), '0-14', 'TOTAL', 'SAARC', 0, 155),
        (gen_random_uuid(), '0-14', 'TOTAL', 'ASIAN', 1, 155),
        (gen_random_uuid(), '0-14', 'TOTAL', 'MIDDLE_EAST', 6, 155),
        (gen_random_uuid(), '0-14', 'TOTAL', 'OTHER_ASIAN', 2, 155),
        (gen_random_uuid(), '0-14', 'TOTAL', 'EUROPE', 0, 155),
        (gen_random_uuid(), '0-14', 'TOTAL', 'OTHER_EUROPE', 0, 155),
        (gen_random_uuid(), '0-14', 'TOTAL', 'NORTH_AMERICA', 6, 155),
        (gen_random_uuid(), '0-14', 'TOTAL', 'AFRICA', 0, 155),
        (gen_random_uuid(), '0-14', 'TOTAL', 'PACIFIC', 1, 155),
        (gen_random_uuid(), '0-14', 'TOTAL', 'OTHER', 0, 155),
        (gen_random_uuid(), '0-14', 'TOTAL', 'NOT_DISCLOSED', 0, 155),

    -- 15-24 years data
        (gen_random_uuid(), '15-24', 'MALE', 'INDIA', 216, 842),
        (gen_random_uuid(), '15-24', 'MALE', 'SAARC', 2, 842),
        (gen_random_uuid(), '15-24', 'MALE', 'ASIAN', 82, 842),
        (gen_random_uuid(), '15-24', 'MALE', 'MIDDLE_EAST', 496, 842),
        (gen_random_uuid(), '15-24', 'MALE', 'OTHER_ASIAN', 28, 842),
        (gen_random_uuid(), '15-24', 'MALE', 'EUROPE', 5, 842),
        (gen_random_uuid(), '15-24', 'MALE', 'OTHER_EUROPE', 4, 842),
        (gen_random_uuid(), '15-24', 'MALE', 'NORTH_AMERICA', 1, 842),
        (gen_random_uuid(), '15-24', 'MALE', 'AFRICA', 2, 842),
        (gen_random_uuid(), '15-24', 'MALE', 'PACIFIC', 0, 842),
        (gen_random_uuid(), '15-24', 'MALE', 'OTHER', 0, 842),
        (gen_random_uuid(), '15-24', 'MALE', 'NOT_DISCLOSED', 0, 842),

        (gen_random_uuid(), '15-24', 'FEMALE', 'INDIA', 88, 109),
        (gen_random_uuid(), '15-24', 'FEMALE', 'SAARC', 4, 109),
        (gen_random_uuid(), '15-24', 'FEMALE', 'ASIAN', 6, 109),
        (gen_random_uuid(), '15-24', 'FEMALE', 'MIDDLE_EAST', 10, 109),
        (gen_random_uuid(), '15-24', 'FEMALE', 'OTHER_ASIAN', 0, 109),
        (gen_random_uuid(), '15-24', 'FEMALE', 'EUROPE', 0, 109),
        (gen_random_uuid(), '15-24', 'FEMALE', 'OTHER_EUROPE', 0, 109),
        (gen_random_uuid(), '15-24', 'FEMALE', 'NORTH_AMERICA', 0, 109),
        (gen_random_uuid(), '15-24', 'FEMALE', 'AFRICA', 0, 109),
        (gen_random_uuid(), '15-24', 'FEMALE', 'PACIFIC', 0, 109),
        (gen_random_uuid(), '15-24', 'FEMALE', 'OTHER', 0, 109),
        (gen_random_uuid(), '15-24', 'FEMALE', 'NOT_DISCLOSED', 1, 109),

        (gen_random_uuid(), '15-24', 'TOTAL', 'INDIA', 304, 951),
        (gen_random_uuid(), '15-24', 'TOTAL', 'SAARC', 2, 951),
        (gen_random_uuid(), '15-24', 'TOTAL', 'ASIAN', 86, 951),
        (gen_random_uuid(), '15-24', 'TOTAL', 'MIDDLE_EAST', 502, 951),
        (gen_random_uuid(), '15-24', 'TOTAL', 'OTHER_ASIAN', 38, 951),
        (gen_random_uuid(), '15-24', 'TOTAL', 'EUROPE', 5, 951),
        (gen_random_uuid(), '15-24', 'TOTAL', 'OTHER_EUROPE', 5, 951),
        (gen_random_uuid(), '15-24', 'TOTAL', 'NORTH_AMERICA', 4, 951),
        (gen_random_uuid(), '15-24', 'TOTAL', 'AFRICA', 1, 951),
        (gen_random_uuid(), '15-24', 'TOTAL', 'PACIFIC', 2, 951),
        (gen_random_uuid(), '15-24', 'TOTAL', 'OTHER', 0, 951),
        (gen_random_uuid(), '15-24', 'TOTAL', 'NOT_DISCLOSED', 2, 951),

    -- 25-34 years data
        (gen_random_uuid(), '25-34', 'MALE', 'INDIA', 150, 662),
        (gen_random_uuid(), '25-34', 'MALE', 'SAARC', 3, 662),
        (gen_random_uuid(), '25-34', 'MALE', 'ASIAN', 58, 662),
        (gen_random_uuid(), '25-34', 'MALE', 'MIDDLE_EAST', 409, 662),
        (gen_random_uuid(), '25-34', 'MALE', 'OTHER_ASIAN', 16, 662),
        (gen_random_uuid(), '25-34', 'MALE', 'EUROPE', 4, 662),
        (gen_random_uuid(), '25-34', 'MALE', 'OTHER_EUROPE', 8, 662),
        (gen_random_uuid(), '25-34', 'MALE', 'NORTH_AMERICA', 9, 662),
        (gen_random_uuid(), '25-34', 'MALE', 'AFRICA', 0, 662),
        (gen_random_uuid(), '25-34', 'MALE', 'PACIFIC', 0, 662),
        (gen_random_uuid(), '25-34', 'MALE', 'OTHER', 1, 662),
        (gen_random_uuid(), '25-34', 'MALE', 'NOT_DISCLOSED', 4, 662),

        (gen_random_uuid(), '25-34', 'FEMALE', 'INDIA', 56, 75),
        (gen_random_uuid(), '25-34', 'FEMALE', 'SAARC', 0, 75),
        (gen_random_uuid(), '25-34', 'FEMALE', 'ASIAN', 2, 75),
        (gen_random_uuid(), '25-34', 'FEMALE', 'MIDDLE_EAST', 7, 75),
        (gen_random_uuid(), '25-34', 'FEMALE', 'OTHER_ASIAN', 6, 75),
        (gen_random_uuid(), '25-34', 'FEMALE', 'EUROPE', 1, 75),
        (gen_random_uuid(), '25-34', 'FEMALE', 'OTHER_EUROPE', 1, 75),
        (gen_random_uuid(), '25-34', 'FEMALE', 'NORTH_AMERICA', 1, 75),
        (gen_random_uuid(), '25-34', 'FEMALE', 'AFRICA', 0, 75),
        (gen_random_uuid(), '25-34', 'FEMALE', 'PACIFIC', 1, 75),
        (gen_random_uuid(), '25-34', 'FEMALE', 'OTHER', 0, 75),
        (gen_random_uuid(), '25-34', 'FEMALE', 'NOT_DISCLOSED', 1, 75),

        (gen_random_uuid(), '25-34', 'TOTAL', 'INDIA', 206, 737),
        (gen_random_uuid(), '25-34', 'TOTAL', 'SAARC', 3, 737),
        (gen_random_uuid(), '25-34', 'TOTAL', 'ASIAN', 60, 737),
        (gen_random_uuid(), '25-34', 'TOTAL', 'MIDDLE_EAST', 416, 737),
        (gen_random_uuid(), '25-34', 'TOTAL', 'OTHER_ASIAN', 22, 737),
        (gen_random_uuid(), '25-34', 'TOTAL', 'EUROPE', 4, 737),
        (gen_random_uuid(), '25-34', 'TOTAL', 'OTHER_EUROPE', 9, 737),
        (gen_random_uuid(), '25-34', 'TOTAL', 'NORTH_AMERICA', 10, 737),
        (gen_random_uuid(), '25-34', 'TOTAL', 'AFRICA', 0, 737),
        (gen_random_uuid(), '25-34', 'TOTAL', 'PACIFIC', 1, 737),
        (gen_random_uuid(), '25-34', 'TOTAL', 'OTHER', 1, 737),
        (gen_random_uuid(), '25-34', 'TOTAL', 'NOT_DISCLOSED', 5, 737),

    -- Continue with remaining age groups...
        (gen_random_uuid(), '35-44', 'MALE', 'INDIA', 67, 284),
        (gen_random_uuid(), '35-44', 'MALE', 'SAARC', 1, 284),
        (gen_random_uuid(), '35-44', 'MALE', 'ASIAN', 21, 284),
        (gen_random_uuid(), '35-44', 'MALE', 'MIDDLE_EAST', 185, 284),
        (gen_random_uuid(), '35-44', 'MALE', 'OTHER_ASIAN', 6, 284),
        (gen_random_uuid(), '35-44', 'MALE', 'EUROPE', 2, 284),
        (gen_random_uuid(), '35-44', 'MALE', 'OTHER_EUROPE', 0, 284),
        (gen_random_uuid(), '35-44', 'MALE', 'NORTH_AMERICA', 2, 284),
        (gen_random_uuid(), '35-44', 'MALE', 'AFRICA', 0, 284),
        (gen_random_uuid(), '35-44', 'MALE', 'PACIFIC', 0, 284),
        (gen_random_uuid(), '35-44', 'MALE', 'OTHER', 0, 284),
        (gen_random_uuid(), '35-44', 'MALE', 'NOT_DISCLOSED', 0, 284),

        (gen_random_uuid(), '35-44', 'FEMALE', 'INDIA', 35, 41),
        (gen_random_uuid(), '35-44', 'FEMALE', 'SAARC', 0, 41),
        (gen_random_uuid(), '35-44', 'FEMALE', 'ASIAN', 1, 41),
        (gen_random_uuid(), '35-44', 'FEMALE', 'MIDDLE_EAST', 4, 41),
        (gen_random_uuid(), '35-44', 'FEMALE', 'OTHER_ASIAN', 0, 41),
        (gen_random_uuid(), '35-44', 'FEMALE', 'EUROPE', 0, 41),
        (gen_random_uuid(), '35-44', 'FEMALE', 'OTHER_EUROPE', 0, 41),
        (gen_random_uuid(), '35-44', 'FEMALE', 'NORTH_AMERICA', 1, 41),
        (gen_random_uuid(), '35-44', 'FEMALE', 'AFRICA', 0, 41),
        (gen_random_uuid(), '35-44', 'FEMALE', 'PACIFIC', 0, 41),
        (gen_random_uuid(), '35-44', 'FEMALE', 'OTHER', 0, 41),
        (gen_random_uuid(), '35-44', 'FEMALE', 'NOT_DISCLOSED', 0, 41),

        (gen_random_uuid(), '35-44', 'TOTAL', 'INDIA', 102, 325),
        (gen_random_uuid(), '35-44', 'TOTAL', 'SAARC', 1, 325),
        (gen_random_uuid(), '35-44', 'TOTAL', 'ASIAN', 22, 325),
        (gen_random_uuid(), '35-44', 'TOTAL', 'MIDDLE_EAST', 189, 325),
        (gen_random_uuid(), '35-44', 'TOTAL', 'OTHER_ASIAN', 6, 325),
        (gen_random_uuid(), '35-44', 'TOTAL', 'EUROPE', 2, 325),
        (gen_random_uuid(), '35-44', 'TOTAL', 'OTHER_EUROPE', 0, 325),
        (gen_random_uuid(), '35-44', 'TOTAL', 'NORTH_AMERICA', 3, 325),
        (gen_random_uuid(), '35-44', 'TOTAL', 'AFRICA', 0, 325),
        (gen_random_uuid(), '35-44', 'TOTAL', 'PACIFIC', 0, 325),
        (gen_random_uuid(), '35-44', 'TOTAL', 'OTHER', 0, 325),
        (gen_random_uuid(), '35-44', 'TOTAL', 'NOT_DISCLOSED', 0, 325),

    -- Continue with remaining data...
        (gen_random_uuid(), '45-54', 'MALE', 'INDIA', 63, 103),
        (gen_random_uuid(), '45-54', 'MALE', 'MIDDLE_EAST', 34, 103),
        (gen_random_uuid(), '45-54', 'MALE', 'ASIAN', 5, 103),
        (gen_random_uuid(), '45-54', 'MALE', 'EUROPE', 1, 103),
        
        (gen_random_uuid(), '45-54', 'FEMALE', 'INDIA', 19, 20),
        (gen_random_uuid(), '45-54', 'FEMALE', 'EUROPE', 1, 20),

        (gen_random_uuid(), '45-54', 'TOTAL', 'INDIA', 82, 123),
        (gen_random_uuid(), '45-54', 'TOTAL', 'MIDDLE_EAST', 34, 123),
        (gen_random_uuid(), '45-54', 'TOTAL', 'ASIAN', 5, 123),
        (gen_random_uuid(), '45-54', 'TOTAL', 'EUROPE', 1, 123),
        (gen_random_uuid(), '45-54', 'TOTAL', 'NOT_DISCLOSED', 19, 123),

        (gen_random_uuid(), '55-64', 'MALE', 'INDIA', 22, 24),
        (gen_random_uuid(), '55-64', 'MALE', 'EUROPE', 1, 24),
        (gen_random_uuid(), '55-64', 'MALE', 'OTHER', 1, 24),
        
        (gen_random_uuid(), '55-64', 'FEMALE', 'INDIA', 3, 3),
        
        (gen_random_uuid(), '55-64', 'TOTAL', 'INDIA', 25, 27),
        (gen_random_uuid(), '55-64', 'TOTAL', 'EUROPE', 1, 27),
        (gen_random_uuid(), '55-64', 'TOTAL', 'OTHER', 1, 27),

        (gen_random_uuid(), '65_PLUS', 'MALE', 'INDIA', 5, 5),
        (gen_random_uuid(), '65_PLUS', 'FEMALE', 'INDIA', 3, 3),
        (gen_random_uuid(), '65_PLUS', 'TOTAL', 'INDIA', 8, 8),

        (gen_random_uuid(), 'NOT_MENTIONED', 'MALE', 'INDIA', 7, 15),
        (gen_random_uuid(), 'NOT_MENTIONED', 'MALE', 'ASIAN', 3, 15),
        (gen_random_uuid(), 'NOT_MENTIONED', 'MALE', 'MIDDLE_EAST', 2, 15),
        (gen_random_uuid(), 'NOT_MENTIONED', 'MALE', 'OTHER_ASIAN', 1, 15),
        (gen_random_uuid(), 'NOT_MENTIONED', 'MALE', 'OTHER', 2, 15),
        
        (gen_random_uuid(), 'NOT_MENTIONED', 'FEMALE', 'INDIA', 1, 2),
        (gen_random_uuid(), 'NOT_MENTIONED', 'FEMALE', 'NOT_DISCLOSED', 1, 2),
        
        (gen_random_uuid(), 'NOT_MENTIONED', 'TOTAL', 'INDIA', 8, 17),
        (gen_random_uuid(), 'NOT_MENTIONED', 'TOTAL', 'ASIAN', 3, 17),
        (gen_random_uuid(), 'NOT_MENTIONED', 'TOTAL', 'MIDDLE_EAST', 2, 17),
        (gen_random_uuid(), 'NOT_MENTIONED', 'TOTAL', 'OTHER_ASIAN', 1, 17),
        (gen_random_uuid(), 'NOT_MENTIONED', 'TOTAL', 'OTHER', 2, 17),
        (gen_random_uuid(), 'NOT_MENTIONED', 'TOTAL', 'NOT_DISCLOSED', 1, 17),

    -- Final totals
        (gen_random_uuid(), 'TOTAL', 'TOTAL', 'INDIA', 874, 2343),
        (gen_random_uuid(), 'TOTAL', 'TOTAL', 'SAARC', 6, 2343),
        (gen_random_uuid(), 'TOTAL', 'TOTAL', 'ASIAN', 177, 2343),
        (gen_random_uuid(), 'TOTAL', 'TOTAL', 'MIDDLE_EAST', 1149, 2343),
        (gen_random_uuid(), 'TOTAL', 'TOTAL', 'OTHER_ASIAN', 69, 2343),
        (gen_random_uuid(), 'TOTAL', 'TOTAL', 'EUROPE', 12, 2343),
        (gen_random_uuid(), 'TOTAL', 'TOTAL', 'OTHER_EUROPE', 16, 2343),
        (gen_random_uuid(), 'TOTAL', 'TOTAL', 'NORTH_AMERICA', 23, 2343),
        (gen_random_uuid(), 'TOTAL', 'TOTAL', 'AFRICA', 1, 2343),
        (gen_random_uuid(), 'TOTAL', 'TOTAL', 'PACIFIC', 4, 2343),
        (gen_random_uuid(), 'TOTAL', 'TOTAL', 'OTHER', 2, 2343),
        (gen_random_uuid(), 'TOTAL', 'TOTAL', 'NOT_DISCLOSED', 10, 2343);
END
$$;
