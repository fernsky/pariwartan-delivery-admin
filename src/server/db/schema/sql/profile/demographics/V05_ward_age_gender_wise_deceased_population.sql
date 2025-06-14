-- Set UTF-8 encoding for this script
SET client_encoding = 'UTF8';

-- Create deceased age group enum type
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'deceased_age_group') THEN
        CREATE TYPE deceased_age_group AS ENUM (
            'AGE_1_YEAR',
            'AGE_1_4_YEARS',
            'AGE_5_9_YEARS',
            'AGE_10_14_YEARS',
            'AGE_15_19_YEARS',
            'AGE_20_24_YEARS',
            'AGE_25_29_YEARS',
            'AGE_30_34_YEARS',
            'AGE_35_39_YEARS',
            'AGE_40_44_YEARS',
            'AGE_45_49_YEARS',
            'AGE_50_54_YEARS',
            'AGE_55_59_YEARS',
            'AGE_60_64_YEARS',
            'AGE_65_69_YEARS',
            'AGE_70_74_YEARS',
            'AGE_75_79_YEARS',
            'AGE_80_AND_ABOVE'
        );
    END IF;
END
$$;

-- Create age_gender_wise_deceased_population table if not exists
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'acme_age_gender_wise_deceased_population') THEN
        CREATE TABLE acme_age_gender_wise_deceased_population (
            id VARCHAR(36) PRIMARY KEY,
            age_group deceased_age_group NOT NULL,
            gender gender NOT NULL,
            deceased_population INTEGER NOT NULL DEFAULT 0,
            updated_at TIMESTAMP DEFAULT NOW(),
            created_at TIMESTAMP DEFAULT NOW()
        );
        
        -- Create indexes for faster lookups
        CREATE INDEX idx_deceased_age_gender ON acme_age_gender_wise_deceased_population(age_group, gender);
        CREATE UNIQUE INDEX idx_deceased_unique_age_gender ON acme_age_gender_wise_deceased_population(age_group, gender);
    END IF;
END
$$;

-- Insert real age-gender-wise deceased population data
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM acme_age_gender_wise_deceased_population LIMIT 1) THEN
        INSERT INTO acme_age_gender_wise_deceased_population (id, age_group, gender, deceased_population)
        VALUES
            -- Male data
            (gen_random_uuid(), 'AGE_1_YEAR', 'MALE', 2),
            (gen_random_uuid(), 'AGE_1_4_YEARS', 'MALE', 1),
            (gen_random_uuid(), 'AGE_5_9_YEARS', 'MALE', 0),
            (gen_random_uuid(), 'AGE_10_14_YEARS', 'MALE', 1),
            (gen_random_uuid(), 'AGE_15_19_YEARS', 'MALE', 1),
            (gen_random_uuid(), 'AGE_20_24_YEARS', 'MALE', 0),
            (gen_random_uuid(), 'AGE_25_29_YEARS', 'MALE', 3),
            (gen_random_uuid(), 'AGE_30_34_YEARS', 'MALE', 3),
            (gen_random_uuid(), 'AGE_35_39_YEARS', 'MALE', 3),
            (gen_random_uuid(), 'AGE_40_44_YEARS', 'MALE', 6),
            (gen_random_uuid(), 'AGE_45_49_YEARS', 'MALE', 3),
            (gen_random_uuid(), 'AGE_50_54_YEARS', 'MALE', 1),
            (gen_random_uuid(), 'AGE_55_59_YEARS', 'MALE', 6),
            (gen_random_uuid(), 'AGE_60_64_YEARS', 'MALE', 2),
            (gen_random_uuid(), 'AGE_65_69_YEARS', 'MALE', 7),
            (gen_random_uuid(), 'AGE_70_74_YEARS', 'MALE', 9),
            (gen_random_uuid(), 'AGE_75_79_YEARS', 'MALE', 5),
            (gen_random_uuid(), 'AGE_80_AND_ABOVE', 'MALE', 10),

            -- Female data
            (gen_random_uuid(), 'AGE_1_YEAR', 'FEMALE', 1),
            (gen_random_uuid(), 'AGE_1_4_YEARS', 'FEMALE', 0),
            (gen_random_uuid(), 'AGE_5_9_YEARS', 'FEMALE', 1),
            (gen_random_uuid(), 'AGE_10_14_YEARS', 'FEMALE', 0),
            (gen_random_uuid(), 'AGE_15_19_YEARS', 'FEMALE', 3),
            (gen_random_uuid(), 'AGE_20_24_YEARS', 'FEMALE', 0),
            (gen_random_uuid(), 'AGE_25_29_YEARS', 'FEMALE', 0),
            (gen_random_uuid(), 'AGE_30_34_YEARS', 'FEMALE', 1),
            (gen_random_uuid(), 'AGE_35_39_YEARS', 'FEMALE', 1),
            (gen_random_uuid(), 'AGE_40_44_YEARS', 'FEMALE', 1),
            (gen_random_uuid(), 'AGE_45_49_YEARS', 'FEMALE', 2),
            (gen_random_uuid(), 'AGE_50_54_YEARS', 'FEMALE', 2),
            (gen_random_uuid(), 'AGE_55_59_YEARS', 'FEMALE', 3),
            (gen_random_uuid(), 'AGE_60_64_YEARS', 'FEMALE', 7),
            (gen_random_uuid(), 'AGE_65_69_YEARS', 'FEMALE', 0),
            (gen_random_uuid(), 'AGE_70_74_YEARS', 'FEMALE', 2),
            (gen_random_uuid(), 'AGE_75_79_YEARS', 'FEMALE', 4),
            (gen_random_uuid(), 'AGE_80_AND_ABOVE', 'FEMALE', 10);

        RAISE NOTICE 'Age gender wise deceased population data inserted successfully';
    ELSE
        RAISE NOTICE 'Age gender wise deceased population data already exists, skipping insertion';
    END IF;
END
$$;
            (gen_random_uuid(), 2, 'AGE_75_AND_ABOVE', 'FEMALE', 8), -- Sum of 75-79(1) + 80-84(3) + 85-89(2) + 90-94(2) + 95-99(0) + 100+(0)

            -- Ward 3 Male data
            (gen_random_uuid(), 3, 'AGE_0_4', 'MALE', 0),
            (gen_random_uuid(), 3, 'AGE_5_9', 'MALE', 0),
            (gen_random_uuid(), 3, 'AGE_10_14', 'MALE', 0),
            (gen_random_uuid(), 3, 'AGE_15_19', 'MALE', 0),
            (gen_random_uuid(), 3, 'AGE_20_24', 'MALE', 0),
            (gen_random_uuid(), 3, 'AGE_25_29', 'MALE', 0),
            (gen_random_uuid(), 3, 'AGE_30_34', 'MALE', 1),
            (gen_random_uuid(), 3, 'AGE_35_39', 'MALE', 1),
            (gen_random_uuid(), 3, 'AGE_40_44', 'MALE', 1),
            (gen_random_uuid(), 3, 'AGE_45_49', 'MALE', 1),
            (gen_random_uuid(), 3, 'AGE_50_54', 'MALE', 1),
            (gen_random_uuid(), 3, 'AGE_55_59', 'MALE', 0),
            (gen_random_uuid(), 3, 'AGE_60_64', 'MALE', 0),
            (gen_random_uuid(), 3, 'AGE_65_69', 'MALE', 5),
            (gen_random_uuid(), 3, 'AGE_70_74', 'MALE', 0),
            (gen_random_uuid(), 3, 'AGE_75_AND_ABOVE', 'MALE', 1), -- Sum of 75-79(0) + 80-84(1) + 85-89(0) + 90-94(0) + 95-99(0) + 100+(0)

            -- Ward 3 Female data
            (gen_random_uuid(), 3, 'AGE_0_4', 'FEMALE', 0),
            (gen_random_uuid(), 3, 'AGE_5_9', 'FEMALE', 0),
            (gen_random_uuid(), 3, 'AGE_10_14', 'FEMALE', 0),
            (gen_random_uuid(), 3, 'AGE_15_19', 'FEMALE', 0),
            (gen_random_uuid(), 3, 'AGE_20_24', 'FEMALE', 0),
            (gen_random_uuid(), 3, 'AGE_25_29', 'FEMALE', 0),
            (gen_random_uuid(), 3, 'AGE_30_34', 'FEMALE', 0),
            (gen_random_uuid(), 3, 'AGE_35_39', 'FEMALE', 0),
            (gen_random_uuid(), 3, 'AGE_40_44', 'FEMALE', 0),
            (gen_random_uuid(), 3, 'AGE_45_49', 'FEMALE', 0),
            (gen_random_uuid(), 3, 'AGE_50_54', 'FEMALE', 0),
            (gen_random_uuid(), 3, 'AGE_55_59', 'FEMALE', 0),
            (gen_random_uuid(), 3, 'AGE_60_64', 'FEMALE', 3),
            (gen_random_uuid(), 3, 'AGE_65_69', 'FEMALE', 1),
            (gen_random_uuid(), 3, 'AGE_70_74', 'FEMALE', 3),
            (gen_random_uuid(), 3, 'AGE_75_AND_ABOVE', 'FEMALE', 1), -- Sum of 75-79(0) + 80-84(1) + 85-89(0) + 90-94(0) + 95-99(0) + 100+(0)

            -- Ward 4 Male data
            (gen_random_uuid(), 4, 'AGE_0_4', 'MALE', 0),
            (gen_random_uuid(), 4, 'AGE_5_9', 'MALE', 0),
            (gen_random_uuid(), 4, 'AGE_10_14', 'MALE', 1),
            (gen_random_uuid(), 4, 'AGE_15_19', 'MALE', 0),
            (gen_random_uuid(), 4, 'AGE_20_24', 'MALE', 1),
            (gen_random_uuid(), 4, 'AGE_25_29', 'MALE', 0),
            (gen_random_uuid(), 4, 'AGE_30_34', 'MALE', 0),
            (gen_random_uuid(), 4, 'AGE_35_39', 'MALE', 0),
            (gen_random_uuid(), 4, 'AGE_40_44', 'MALE', 0),
            (gen_random_uuid(), 4, 'AGE_45_49', 'MALE', 1),
            (gen_random_uuid(), 4, 'AGE_50_54', 'MALE', 0),
            (gen_random_uuid(), 4, 'AGE_55_59', 'MALE', 4),
            (gen_random_uuid(), 4, 'AGE_60_64', 'MALE', 1),
            (gen_random_uuid(), 4, 'AGE_65_69', 'MALE', 1),
            (gen_random_uuid(), 4, 'AGE_70_74', 'MALE', 4),
            (gen_random_uuid(), 4, 'AGE_75_AND_ABOVE', 'MALE', 3), -- Sum of 75-79(1) + 80-84(0) + 85-89(0) + 90-94(0) + 95-99(1) + 100+(1)

            -- Ward 4 Female data
            (gen_random_uuid(), 4, 'AGE_0_4', 'FEMALE', 0),
            (gen_random_uuid(), 4, 'AGE_5_9', 'FEMALE', 0),
            (gen_random_uuid(), 4, 'AGE_10_14', 'FEMALE', 0),
            (gen_random_uuid(), 4, 'AGE_15_19', 'FEMALE', 0),
            (gen_random_uuid(), 4, 'AGE_20_24', 'FEMALE', 0),
            (gen_random_uuid(), 4, 'AGE_25_29', 'FEMALE', 2),
            (gen_random_uuid(), 4, 'AGE_30_34', 'FEMALE', 2),
            (gen_random_uuid(), 4, 'AGE_35_39', 'FEMALE', 0),
            (gen_random_uuid(), 4, 'AGE_40_44', 'FEMALE', 0),
            (gen_random_uuid(), 4, 'AGE_45_49', 'FEMALE', 0),
            (gen_random_uuid(), 4, 'AGE_50_54', 'FEMALE', 0),
            (gen_random_uuid(), 4, 'AGE_55_59', 'FEMALE', 0),
            (gen_random_uuid(), 4, 'AGE_60_64', 'FEMALE', 0),
            (gen_random_uuid(), 4, 'AGE_65_69', 'FEMALE', 0),
            (gen_random_uuid(), 4, 'AGE_70_74', 'FEMALE', 0),
            (gen_random_uuid(), 4, 'AGE_75_AND_ABOVE', 'FEMALE', 0), -- Sum of 75-79(0) + 80-84(0) + 85-89(0) + 90-94(0) + 95-99(0) + 100+(0)

            -- Ward 5 Male data
            (gen_random_uuid(), 5, 'AGE_0_4', 'MALE', 5),
            (gen_random_uuid(), 5, 'AGE_5_9', 'MALE', 0),
            (gen_random_uuid(), 5, 'AGE_10_14', 'MALE', 0),
            (gen_random_uuid(), 5, 'AGE_15_19', 'MALE', 0),
            (gen_random_uuid(), 5, 'AGE_20_24', 'MALE', 0),
            (gen_random_uuid(), 5, 'AGE_25_29', 'MALE', 0),
            (gen_random_uuid(), 5, 'AGE_30_34', 'MALE', 0),
            (gen_random_uuid(), 5, 'AGE_35_39', 'MALE', 1),
            (gen_random_uuid(), 5, 'AGE_40_44', 'MALE', 0),
            (gen_random_uuid(), 5, 'AGE_45_49', 'MALE', 0),
            (gen_random_uuid(), 5, 'AGE_50_54', 'MALE', 0),
            (gen_random_uuid(), 5, 'AGE_55_59', 'MALE', 0),
            (gen_random_uuid(), 5, 'AGE_60_64', 'MALE', 0),
            (gen_random_uuid(), 5, 'AGE_65_69', 'MALE', 0),
            (gen_random_uuid(), 5, 'AGE_70_74', 'MALE', 2),
            (gen_random_uuid(), 5, 'AGE_75_AND_ABOVE', 'MALE', 3), -- Sum of 75-79(0) + 80-84(1) + 85-89(0) + 90-94(2) + 95-99(0) + 100+(0)

            -- Ward 5 Female data
            (gen_random_uuid(), 5, 'AGE_0_4', 'FEMALE', 3),
            (gen_random_uuid(), 5, 'AGE_5_9', 'FEMALE', 1),
            (gen_random_uuid(), 5, 'AGE_10_14', 'FEMALE', 0),
            (gen_random_uuid(), 5, 'AGE_15_19', 'FEMALE', 0),
            (gen_random_uuid(), 5, 'AGE_20_24', 'FEMALE', 0),
            (gen_random_uuid(), 5, 'AGE_25_29', 'FEMALE', 0),
            (gen_random_uuid(), 5, 'AGE_30_34', 'FEMALE', 1),
            (gen_random_uuid(), 5, 'AGE_35_39', 'FEMALE', 0),
            (gen_random_uuid(), 5, 'AGE_40_44', 'FEMALE', 1),
            (gen_random_uuid(), 5, 'AGE_45_49', 'FEMALE', 0),
            (gen_random_uuid(), 5, 'AGE_50_54', 'FEMALE', 2),
            (gen_random_uuid(), 5, 'AGE_55_59', 'FEMALE', 0),
            (gen_random_uuid(), 5, 'AGE_60_64', 'FEMALE', 1),
            (gen_random_uuid(), 5, 'AGE_65_69', 'FEMALE', 0),
            (gen_random_uuid(), 5, 'AGE_70_74', 'FEMALE', 0),
            (gen_random_uuid(), 5, 'AGE_75_AND_ABOVE', 'FEMALE', 2), -- Sum of 75-79(0) + 80-84(0) + 85-89(0) + 90-94(1) + 95-99(0) + 100+(1)

            -- Ward 6 Male data
            (gen_random_uuid(), 6, 'AGE_0_4', 'MALE', 0),
            (gen_random_uuid(), 6, 'AGE_5_9', 'MALE', 1),
            (gen_random_uuid(), 6, 'AGE_10_14', 'MALE', 1),
            (gen_random_uuid(), 6, 'AGE_15_19', 'MALE', 0),
            (gen_random_uuid(), 6, 'AGE_20_24', 'MALE', 1),
            (gen_random_uuid(), 6, 'AGE_25_29', 'MALE', 1),
            (gen_random_uuid(), 6, 'AGE_30_34', 'MALE', 0),
            (gen_random_uuid(), 6, 'AGE_35_39', 'MALE', 1),
            (gen_random_uuid(), 6, 'AGE_40_44', 'MALE', 0),
            (gen_random_uuid(), 6, 'AGE_45_49', 'MALE', 2),
            (gen_random_uuid(), 6, 'AGE_50_54', 'MALE', 1),
            (gen_random_uuid(), 6, 'AGE_55_59', 'MALE', 2),
            (gen_random_uuid(), 6, 'AGE_60_64', 'MALE', 3),
            (gen_random_uuid(), 6, 'AGE_65_69', 'MALE', 3),
            (gen_random_uuid(), 6, 'AGE_70_74', 'MALE', 5),
            (gen_random_uuid(), 6, 'AGE_75_AND_ABOVE', 'MALE', 3), -- Sum of 75-79(0) + 80-84(3) + 85-89(0) + 90-94(0) + 95-99(0) + 100+(0)

            -- Ward 6 Female data
            (gen_random_uuid(), 6, 'AGE_0_4', 'FEMALE', 1),
            (gen_random_uuid(), 6, 'AGE_5_9', 'FEMALE', 0),
            (gen_random_uuid(), 6, 'AGE_10_14', 'FEMALE', 0),
            (gen_random_uuid(), 6, 'AGE_15_19', 'FEMALE', 0),
            (gen_random_uuid(), 6, 'AGE_20_24', 'FEMALE', 0),
            (gen_random_uuid(), 6, 'AGE_25_29', 'FEMALE', 0),
            (gen_random_uuid(), 6, 'AGE_30_34', 'FEMALE', 2),
            (gen_random_uuid(), 6, 'AGE_35_39', 'FEMALE', 1),
            (gen_random_uuid(), 6, 'AGE_40_44', 'FEMALE', 2),
            (gen_random_uuid(), 6, 'AGE_45_49', 'FEMALE', 1),
            (gen_random_uuid(), 6, 'AGE_50_54', 'FEMALE', 1),
            (gen_random_uuid(), 6, 'AGE_55_59', 'FEMALE', 1),
            (gen_random_uuid(), 6, 'AGE_60_64', 'FEMALE', 3),
            (gen_random_uuid(), 6, 'AGE_65_69', 'FEMALE', 1),
            (gen_random_uuid(), 6, 'AGE_70_74', 'FEMALE', 1),
            (gen_random_uuid(), 6, 'AGE_75_AND_ABOVE', 'FEMALE', 4), -- Sum of 75-79(2) + 80-84(1) + 85-89(0) + 90-94(0) + 95-99(1) + 100+(0)

            -- Ward 7 Male data
            (gen_random_uuid(), 7, 'AGE_0_4', 'MALE', 0),
            (gen_random_uuid(), 7, 'AGE_5_9', 'MALE', 0),
            (gen_random_uuid(), 7, 'AGE_10_14', 'MALE', 0),
            (gen_random_uuid(), 7, 'AGE_15_19', 'MALE', 1),
            (gen_random_uuid(), 7, 'AGE_20_24', 'MALE', 0),
            (gen_random_uuid(), 7, 'AGE_25_29', 'MALE', 0),
            (gen_random_uuid(), 7, 'AGE_30_34', 'MALE', 2),
            (gen_random_uuid(), 7, 'AGE_35_39', 'MALE', 1),
            (gen_random_uuid(), 7, 'AGE_40_44', 'MALE', 0),
            (gen_random_uuid(), 7, 'AGE_45_49', 'MALE', 1),
            (gen_random_uuid(), 7, 'AGE_50_54', 'MALE', 1),
            (gen_random_uuid(), 7, 'AGE_55_59', 'MALE', 0),
            (gen_random_uuid(), 7, 'AGE_60_64', 'MALE', 0),
            (gen_random_uuid(), 7, 'AGE_65_69', 'MALE', 0),
            (gen_random_uuid(), 7, 'AGE_70_74', 'MALE', 0),
            (gen_random_uuid(), 7, 'AGE_75_AND_ABOVE', 'MALE', 5), -- Sum of 75-79(1) + 80-84(1) + 85-89(2) + 90-94(0) + 95-99(0) + 100+(1)

            -- Ward 7 Female data
            (gen_random_uuid(), 7, 'AGE_0_4', 'FEMALE', 0),
            (gen_random_uuid(), 7, 'AGE_5_9', 'FEMALE', 0),
            (gen_random_uuid(), 7, 'AGE_10_14', 'FEMALE', 0),
            (gen_random_uuid(), 7, 'AGE_15_19', 'FEMALE', 0),
            (gen_random_uuid(), 7, 'AGE_20_24', 'FEMALE', 0),
            (gen_random_uuid(), 7, 'AGE_25_29', 'FEMALE', 0),
            (gen_random_uuid(), 7, 'AGE_30_34', 'FEMALE', 1),
            (gen_random_uuid(), 7, 'AGE_35_39', 'FEMALE', 1),
            (gen_random_uuid(), 7, 'AGE_40_44', 'FEMALE', 0),
            (gen_random_uuid(), 7, 'AGE_45_49', 'FEMALE', 0),
            (gen_random_uuid(), 7, 'AGE_50_54', 'FEMALE', 1),
            (gen_random_uuid(), 7, 'AGE_55_59', 'FEMALE', 0),
            (gen_random_uuid(), 7, 'AGE_60_64', 'FEMALE', 0),
            (gen_random_uuid(), 7, 'AGE_65_69', 'FEMALE', 3),
            (gen_random_uuid(), 7, 'AGE_70_74', 'FEMALE', 0),
            (gen_random_uuid(), 7, 'AGE_75_AND_ABOVE', 'FEMALE', 2), -- Sum of 75-79(0) + 80-84(0) + 85-89(1) + 90-94(0) + 95-99(0) + 100+(1)

            -- Ward 8 Male data
            (gen_random_uuid(), 8, 'AGE_0_4', 'MALE', 1),
            (gen_random_uuid(), 8, 'AGE_5_9', 'MALE', 0),
            (gen_random_uuid(), 8, 'AGE_10_14', 'MALE', 0),
            (gen_random_uuid(), 8, 'AGE_15_19', 'MALE', 0),
            (gen_random_uuid(), 8, 'AGE_20_24', 'MALE', 0),
            (gen_random_uuid(), 8, 'AGE_25_29', 'MALE', 0),
            (gen_random_uuid(), 8, 'AGE_30_34', 'MALE', 0),
            (gen_random_uuid(), 8, 'AGE_35_39', 'MALE', 1),
            (gen_random_uuid(), 8, 'AGE_40_44', 'MALE', 0),
            (gen_random_uuid(), 8, 'AGE_45_49', 'MALE', 0),
            (gen_random_uuid(), 8, 'AGE_50_54', 'MALE', 1),
            (gen_random_uuid(), 8, 'AGE_55_59', 'MALE', 0),
            (gen_random_uuid(), 8, 'AGE_60_64', 'MALE', 0),
            (gen_random_uuid(), 8, 'AGE_65_69', 'MALE', 1),
            (gen_random_uuid(), 8, 'AGE_70_74', 'MALE', 2),
            (gen_random_uuid(), 8, 'AGE_75_AND_ABOVE', 'MALE', 2), -- Sum of 75-79(0) + 80-84(0) + 85-89(0) + 90-94(0) + 95-99(1) + 100+(1)

            -- Ward 8 Female data
            (gen_random_uuid(), 8, 'AGE_0_4', 'FEMALE', 1),
            (gen_random_uuid(), 8, 'AGE_5_9', 'FEMALE', 0),
            (gen_random_uuid(), 8, 'AGE_10_14', 'FEMALE', 1),
            (gen_random_uuid(), 8, 'AGE_15_19', 'FEMALE', 0),
            (gen_random_uuid(), 8, 'AGE_20_24', 'FEMALE', 0),
            (gen_random_uuid(), 8, 'AGE_25_29', 'FEMALE', 0),
            (gen_random_uuid(), 8, 'AGE_30_34', 'FEMALE', 0),
            (gen_random_uuid(), 8, 'AGE_35_39', 'FEMALE', 0),
            (gen_random_uuid(), 8, 'AGE_40_44', 'FEMALE', 2),
            (gen_random_uuid(), 8, 'AGE_45_49', 'FEMALE', 0),
            (gen_random_uuid(), 8, 'AGE_50_54', 'FEMALE', 0),
            (gen_random_uuid(), 8, 'AGE_55_59', 'FEMALE', 0),
            (gen_random_uuid(), 8, 'AGE_60_64', 'FEMALE', 0),
            (gen_random_uuid(), 8, 'AGE_65_69', 'FEMALE', 0),
            (gen_random_uuid(), 8, 'AGE_70_74', 'FEMALE', 1),
            (gen_random_uuid(), 8, 'AGE_75_AND_ABOVE', 'FEMALE', 1); -- Sum of 75-79(1) + 80-84(0) + 85-89(0) + 90-94(0) + 95-99(0) + 100+(0)

        RAISE NOTICE 'Ward age gender wise deceased population data inserted successfully';
    ELSE
        RAISE NOTICE 'Ward age gender wise deceased population data already exists, skipping insertion';
    END IF;
END
$$;
