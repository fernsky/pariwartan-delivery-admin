-- Check if demographic_summary table exists, if not create it
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'demographic_summary') THEN
        CREATE TABLE demographic_summary (
            id VARCHAR(36) PRIMARY KEY DEFAULT 'singleton',
            total_population INTEGER,
            population_male INTEGER,
            population_female INTEGER,
            population_other INTEGER,
            population_absentee_total INTEGER,
            population_male_absentee INTEGER,
            population_female_absentee INTEGER,
            population_other_absentee INTEGER,
            sex_ratio DECIMAL,
            total_households INTEGER,
            average_household_size DECIMAL,
            population_density DECIMAL,
            population_0_to_14 INTEGER,
            population_15_to_59 INTEGER,
            population_60_and_above INTEGER,
            growth_rate DECIMAL,
            literacy_rate_above_15 DECIMAL,
            literacy_rate_15_to_24 DECIMAL,
            updated_at TIMESTAMP DEFAULT NOW(),
            created_at TIMESTAMP DEFAULT NOW()
        );
    END IF;
END
$$;

-- Check if data already exists before inserting
DO $$
BEGIN
    -- Only insert if the singleton record doesn't exist
    IF NOT EXISTS (SELECT 1 FROM demographic_summary WHERE id = 'singleton') THEN
        INSERT INTO demographic_summary (
            id,
            total_population,
            population_male,
            population_female,
            sex_ratio,
            total_households,
            average_household_size,
            population_density,
            population_0_to_14,
            population_15_to_59,
            population_60_and_above,
            growth_rate,
            literacy_rate_above_15
        ) VALUES (
            'singleton',
            64908,                 -- जम्मा जनसंख्या (combining both datasets)
            30515,                 -- जम्मा पुरुष (Total Male)
            34393,                 -- जम्मा महिला (Total Female)
            89.98,                 -- लैंगिक दर (प्रति १०० महिलामा पुरुषको संख्या)
            15530,                 -- कुल परिवार (Total Households)
            4.0,                   -- औषत परिवार आकार (Average Household Size)
            636.91,                -- जनघनत्व (प्रतिवर्ग कि.मी.)
            16467,                 -- ०–१४ वर्ष उमेरसमूहका जनसंख्या
            42697,                 -- १५–५९ वर्ष उमेरसमूहका जनसंख्या
            5744,                  -- ६० वर्षभन्दा बढी उमेरसमूहका जनसंख्या
            2.74,                  -- वार्षिक जनसंख्या वृद्धिदर (प्रतिशत)
            68.32                  -- साक्षरता दर (५ वर्ष र सोभन्दा बढी उमेरसमूह)
        );

        RAISE NOTICE 'Demographic summary data inserted successfully';
    ELSE
        RAISE NOTICE 'Demographic summary data already exists, skipping insertion';
    END IF;
END
$$;
        );

        RAISE NOTICE 'Demographic summary data inserted successfully';
    ELSE
        RAISE NOTICE 'Demographic summary data already exists, skipping insertion';
    END IF;
END
$$;
