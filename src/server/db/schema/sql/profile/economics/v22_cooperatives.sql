-- Check if acme_cooperatives table exists, if not create it
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_tables WHERE tablename = 'acme_cooperatives'
    ) THEN
        CREATE TABLE acme_cooperatives (
            id VARCHAR(36) PRIMARY KEY,
            cooperative_name VARCHAR(255) NOT NULL,
            ward_number INTEGER NOT NULL,
            cooperative_type VARCHAR(50) NOT NULL,
            address VARCHAR(255),
            phone_number VARCHAR(20),
            remarks TEXT,
            updated_at TIMESTAMP DEFAULT NOW(),
            created_at TIMESTAMP DEFAULT NOW()
        );
    END IF;
END
$$;

-- Delete existing data to ensure clean insertion
DO $$
BEGIN
    DELETE FROM acme_cooperatives;
END
$$;

-- Insert data from the provided dataset
DO $$
BEGIN
    INSERT INTO acme_cooperatives (id, cooperative_name, ward_number, cooperative_type, address, phone_number, remarks)
    VALUES 
    (gen_random_uuid(), 'इरावती साना किसान कृषि सहकारी लि.', 3, 'AGRICULTURE', 'परिवर्तन गा.पा.-३ रोल्पा', '', ''),
    (gen_random_uuid(), 'पूर्णिमा कृषि सहकारी संस्था लि.', 5, 'AGRICULTURE', 'परिवर्तन गा.पा.-५ रोल्पा', '', ''),
    (gen_random_uuid(), 'महिला जनजागरण बहुउद्देश्यीय सहकारी संस्था लि.', 4, 'MULTI_PURPOSE', 'परिवर्तन गा.पा.-४ रोल्पा', '', ''),
    (gen_random_uuid(), 'प्रोभिन कृषि जनसहकारी संस्था लि.', 1, 'AGRICULTURE_COOPERATIVE', 'परिवर्तन गा.पा.-१ रोल्पा', '', ''),
    (gen_random_uuid(), 'जनजागरण बहुउद्देश्यीय सहकारी संस्था लि.', 5, 'MULTI_PURPOSE', 'परिवर्तन गा.पा.-५ रोल्पा', '', ''),
    (gen_random_uuid(), 'दुर्गेश्वरी काव्रीपानी वन बहुउद्देश्यीय सहकारी संस्था लि.', 4, 'MULTI_PURPOSE', 'परिवर्तन गा.पा.-४ रोल्पा', '', ''),
    (gen_random_uuid(), 'सचेतना कृषि जन सहकारी संस्था लि.', 5, 'AGRICULTURE_COOPERATIVE', 'परिवर्तन गा.पा.-५ रोल्पा', '', ''),
    (gen_random_uuid(), 'भिन्नजुली बचत तथा ऋण सहकारी संस्था लि.', 6, 'SAVINGS_CREDIT', 'परिवर्तन गा.पा.-६ रोल्पा', '', ''),
    (gen_random_uuid(), 'सयपानी बचत तथा ऋण सहकारी संस्था लि.', 3, 'SAVINGS_CREDIT', 'परिवर्तन गा.पा.-३ रोल्पा', '', ''),
    (gen_random_uuid(), 'नमुना बहुउद्देश्यीय सहकारी संस्था लि.', 1, 'MULTI_PURPOSE', 'परिवर्तन गा.पा.-१ रोल्पा', '', ''),
    (gen_random_uuid(), 'समावेशी बहुउद्देश्यीय सहकारी संस्था लि.', 2, 'MULTI_PURPOSE', 'परिवर्तन गा.पा.-२ रोल्पा', '', ''),
    (gen_random_uuid(), 'मेलवाटे शिक्षक कर्मचारी बहुउद्देश्यीय सहकारी संस्था लि.', 5, 'MULTI_PURPOSE', 'परिवर्तन गा.पा.-५ रोल्पा', '', ''),
    (gen_random_uuid(), 'चमेली बहुउद्देश्यीय सहकारी संस्था लि.', 5, 'MULTI_PURPOSE', 'परिवर्तन गा.पा.-५ रोल्पा', '', '');
END
$$;
    