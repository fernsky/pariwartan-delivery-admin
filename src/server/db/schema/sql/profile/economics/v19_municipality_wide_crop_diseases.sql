-- Check if acme_municipality_wide_crop_diseases table exists, if not create it
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_tables WHERE tablename = 'acme_municipality_wide_crop_diseases'
    ) THEN
        CREATE TABLE acme_municipality_wide_crop_diseases (
            id VARCHAR(36) PRIMARY KEY,
            crop VARCHAR(50) NOT NULL,
            major_pests TEXT NOT NULL,
            major_diseases TEXT NOT NULL,
            updated_at TIMESTAMP DEFAULT NOW(),
            created_at TIMESTAMP DEFAULT NOW()
        );
    END IF;
END
$$;

-- Delete existing data to ensure clean insertion
DO $$
BEGIN
    DELETE FROM acme_municipality_wide_crop_diseases;
END
$$;

-- Insert data from the provided dataset
DO $$
BEGIN
    -- Rice (धान)
    INSERT INTO acme_municipality_wide_crop_diseases (id, crop, major_pests, major_diseases)
    VALUES (gen_random_uuid(), 'RICE', 'फड्के, फट्याङ्ग्रा, गवारो, हिरपा', 'मरुवा, डडुवा, खैरे रोग');

    -- Wheat (गहुँ)
    INSERT INTO acme_municipality_wide_crop_diseases (id, crop, major_pests, major_diseases)
    VALUES (gen_random_uuid(), 'WHEAT', 'कीटिकिटे, धमिरा, लाही', 'कालो पोके, पहेँलो सिन्दुरे, खैरो सिन्दुरे, डडुवा, गहाउने कालो पोके');
    
    -- Corn (मकै)
    INSERT INTO acme_municipality_wide_crop_diseases (id, crop, major_pests, major_diseases)
    VALUES (gen_random_uuid(), 'CORN', 'अमेरिकी फौजी कीरा, खुम्रे कीरा, गवारो, फेदकटुवा', 'ध्वाँसे ठोटले रोग, उत्तरी पाते डडुवा, दक्षिणी पाते डडुवा, डाँठ कुहिने रोग');
    
    -- Mustard (तोरी)
    INSERT INTO acme_municipality_wide_crop_diseases (id, crop, major_pests, major_diseases)
    VALUES (gen_random_uuid(), 'MUSTARD', 'करौते फिँङ्गा, लाही', 'करौते फिँङ्गा, लाही');
    
    -- Potato (आलु)
    INSERT INTO acme_municipality_wide_crop_diseases (id, crop, major_pests, major_diseases)
    VALUES (gen_random_uuid(), 'POTATO', 'फेदकटुवा, आलुको पुतली, रातो केमिला, लाही', 'फेदकटुवा, आलुको पुतली, रातो केमिला, लाही');
END
$$;