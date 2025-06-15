-- Check if acme_municipality_wide_vegetables_and_fruits_diseases table exists, if not create it
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_tables WHERE tablename = 'acme_municipality_wide_vegetables_and_fruits_diseases'
    ) THEN
        CREATE TABLE acme_municipality_wide_vegetables_and_fruits_diseases (
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
    DELETE FROM acme_municipality_wide_vegetables_and_fruits_diseases;
END
$$;

-- Insert data from the provided dataset
DO $$
BEGIN
    -- Tomato (गोलभेँडा)
    INSERT INTO acme_municipality_wide_vegetables_and_fruits_diseases (id, crop, major_pests, major_diseases)
    VALUES (gen_random_uuid(), 'TOMATO', 'ट्राइपस्पट, सेतो फिँग्रा, लाही, फलको गवारो, टेपरे आदि', 'डडुवा-अगोटे, पछोटे आईहाल्ने, ममाघाइप आदि');

    -- Cauliflower (काउली)
    INSERT INTO acme_municipality_wide_vegetables_and_fruits_diseases (id, crop, major_pests, major_diseases)
    VALUES (gen_random_uuid(), 'CAULIFLOWER', 'डाईमण्ड ब्याक मोथ, टोकाको स्पाटरफ्लर, लाही, उफ्ने फड्के आदि', 'स्पफटर, ब्लाक रट, अल्टरनेरिया, ब्लक रट डेमेज अफ आदि');
    
    -- Cabbage (बन्दा)
    INSERT INTO acme_municipality_wide_vegetables_and_fruits_diseases (id, crop, major_pests, major_diseases)
    VALUES (gen_random_uuid(), 'CABBAGE', 'डाईमण्ड ब्याक मोथ, टोकाको स्पाटरफ्लर, लाही, उफ्ने फड्के आदि', 'स्पफटर, ब्लाक रट, अल्टरनेरिया, ब्लक रट डेमेज अफ आदि');
    
    -- Potato (आलु)
    INSERT INTO acme_municipality_wide_vegetables_and_fruits_diseases (id, crop, major_pests, major_diseases)
    VALUES (gen_random_uuid(), 'POTATO', 'आलुको पुतली, रातो केमिला, पात खाने लार्भे आदि', 'डडुवा, मोजाइक खैरो पिप, फेदकटुवा, लाही, चक्के आदि');
    
    -- Walnut (ओखर)
    INSERT INTO acme_municipality_wide_vegetables_and_fruits_diseases (id, crop, major_pests, major_diseases)
    VALUES (gen_random_uuid(), 'WALNUT', 'गवारो (trunk shoot borer), ओखरको धपेटे (walnut weevil), लाही किरा', 'फेद तथा जरा कुहिने रोग (foot & root rot), खैरो पात झर्ने रोग (anthracnose), गलगाँठ');
    
    -- Citrus (सुन्तला/कागती)
    INSERT INTO acme_municipality_wide_vegetables_and_fruits_diseases (id, crop, major_pests, major_diseases)
    VALUES (gen_random_uuid(), 'CITRUS', 'aphid, कोड्लिङ्ग मोथ (codling moth), फिँग्रा (husk fly), क्याकर, फूट रट, रस्टर, हरियो पतेरो, फल कुहाउने फिँग्रा (fruit fly), सिट्रिसमोल्ड, citrus psylla, Leaf miner, Red spider mite, blue bettle, stem & trunk borer, लाही, थ्रिप्स, निमाटोडs, Lemon butterfly, किरा आदि', 'रोग (crown gall), ओखरको डडुवा रोग (walnut blight), टुप्पा सुक्ने रोग (die-back), पतेरो, लाही, फूट फलाई, स्केल लिप, जरा कुहिने रोग, फेद कुहिने, खरानी / धुप, भाइरिन, pink disease, anthracnose, दाँते रोग (citrus scab), गुड निस्कने रोग (Gummosis), कालो धवाँसे (sooty mould), Canker, Citrus greening, Citrus tristeza virus CTV, लेमन डग आदि');
    
    -- Kiwi (किवी)
    INSERT INTO acme_municipality_wide_vegetables_and_fruits_diseases (id, crop, major_pests, major_diseases)
    VALUES (gen_random_uuid(), 'KIWI', 'किवी फलमा लाग्ने पुतली किरा, किवी फलको पेत्तामा खाल पर्ने किरा, पातमा लाग्ने भुईतल किरा, Foot borer', 'जरा कुहिने रोग (phytophthora rot), Bacterial blassm rot');
    
    -- Apple (स्याउ)
    INSERT INTO acme_municipality_wide_vegetables_and_fruits_diseases (id, crop, major_pests, major_diseases)
    VALUES (gen_random_uuid(), 'APPLE', 'सेतो भुँडाल्त लाही किरा (wooly aphid), स्याउमा लाग्ने कल्ल किरा (sanjose scale), सुनिल किरा (tent caterpillar), रातो माकुरो (red spider mite), गवारो किरा (apple borer)', 'apple scab, Root rot, collar rot, powdery mildew, papery bark or pink disease, sooty blotch, डडुवा रोग (fire blight)');
    
    -- Mustard (रायो) - keeping existing data
    INSERT INTO acme_municipality_wide_vegetables_and_fruits_diseases (id, crop, major_pests, major_diseases)
    VALUES (gen_random_uuid(), 'MUSTARD', 'डाईमण्ड ब्याक मोथ, टोवाको क्याटरपिलर, लाही, उफ्रने फडके आदि', 'सफ्ट रट, ब्लाक रट, अल्टरवेरिया, क्लव रुट डेम्पीङ अफ आदि');
END
$$;
