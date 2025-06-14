-- Check if acme_disability_by_age table exists, if not create it
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_tables WHERE tablename = 'acme_disability_by_age'
    ) THEN
        CREATE TABLE acme_disability_by_age (
            id VARCHAR(36) PRIMARY KEY,
            age_group VARCHAR(50) NOT NULL,
            physical_disability INTEGER NOT NULL CHECK (physical_disability >= 0),
            visual_impairment INTEGER NOT NULL CHECK (visual_impairment >= 0),
            hearing_impairment INTEGER NOT NULL CHECK (hearing_impairment >= 0),
            deaf_mute INTEGER NOT NULL CHECK (deaf_mute >= 0),
            speech_hearing_combined INTEGER NOT NULL CHECK (speech_hearing_combined >= 0),
            intellectual_disability INTEGER NOT NULL CHECK (intellectual_disability >= 0),
            mental_psychosocial INTEGER NOT NULL CHECK (mental_psychosocial >= 0),
            autism INTEGER NOT NULL CHECK (autism >= 0),
            multiple_disabilities INTEGER NOT NULL CHECK (multiple_disabilities >= 0),
            other_disabilities INTEGER NOT NULL CHECK (other_disabilities >= 0),
            total INTEGER NOT NULL CHECK (total >= 0),
            updated_at TIMESTAMP DEFAULT NOW(),
            created_at TIMESTAMP DEFAULT NOW()
        );
    END IF;
END
$$;

-- Insert the provided data if table is empty
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM acme_disability_by_age) THEN
        INSERT INTO acme_disability_by_age (
            id, age_group, physical_disability, visual_impairment, hearing_impairment, 
            deaf_mute, speech_hearing_combined, intellectual_disability, mental_psychosocial, 
            autism, multiple_disabilities, other_disabilities, total
        )
        VALUES
        (gen_random_uuid(), '०-४ वर्ष', 29, 0, 4, 2, 0, 0, 1, 0, 0, 0, 36),
        (gen_random_uuid(), '५-९ वर्ष', 21, 2, 2, 1, 1, 2, 3, 0, 0, 0, 36),
        (gen_random_uuid(), '१०-१४ वर्ष', 19, 2, 2, 5, 6, 0, 3, 1, 0, 0, 40),
        (gen_random_uuid(), '१५-१९ वर्ष', 25, 8, 2, 5, 0, 0, 2, 3, 1, 0, 54),
        (gen_random_uuid(), '२०-२४ वर्ष', 16, 1, 3, 8, 1, 1, 6, 2, 2, 0, 44),
        (gen_random_uuid(), '२५-२९ वर्ष', 13, 1, 0, 2, 3, 0, 5, 0, 2, 1, 27),
        (gen_random_uuid(), '३०-३४ वर्ष', 13, 3, 0, 3, 4, 2, 3, 1, 0, 0, 37),
        (gen_random_uuid(), '३५-३९ वर्ष', 9, 1, 1, 1, 2, 1, 0, 1, 0, 0, 20),
        (gen_random_uuid(), '४०-४४ वर्ष', 18, 1, 0, 2, 1, 1, 2, 1, 0, 0, 29),
        (gen_random_uuid(), '४५-४९ वर्ष', 11, 3, 0, 3, 1, 1, 1, 1, 1, 0, 23),
        (gen_random_uuid(), '५०-५४ वर्ष', 23, 0, 2, 3, 2, 2, 1, 1, 1, 0, 42),
        (gen_random_uuid(), '५५-५९ वर्ष', 20, 2, 3, 5, 3, 1, 2, 1, 0, 0, 41),
        (gen_random_uuid(), '६०-६४ वर्ष', 24, 3, 1, 10, 3, 1, 3, 0, 0, 0, 46),
        (gen_random_uuid(), '६५-६९ वर्ष', 21, 4, 1, 7, 4, 1, 1, 0, 1, 0, 47),
        (gen_random_uuid(), '७०-७४ वर्ष', 18, 4, 2, 7, 6, 2, 3, 0, 0, 0, 46),
        (gen_random_uuid(), '७५वर्षमाथि', 27, 6, 1, 4, 9, 3, 1, 2, 0, 0, 57),
        (gen_random_uuid(), 'जम्मा', 307, 41, 24, 68, 46, 18, 37, 14, 8, 1, 625);
    END IF;
END
$$;
        (gen_random_uuid(), 6, 'CONGENITAL', 41),

        -- Ward 7
        (gen_random_uuid(), 7, 'DISEASE', 10),
        (gen_random_uuid(), 7, 'ACCIDENT', 11),
        (gen_random_uuid(), 7, 'CONGENITAL', 19),
        (gen_random_uuid(), 7, 'MALNUTRITION', 1),
        (gen_random_uuid(), 7, 'CONFLICT', 1),

        -- Ward 8
        (gen_random_uuid(), 8, 'DISEASE', 5),
        (gen_random_uuid(), 8, 'ACCIDENT', 7),
        (gen_random_uuid(), 8, 'CONGENITAL', 22);
    END IF;
END
$$;
