CREATE TABLE IF NOT EXISTS municipality_wide_agriculture_representatives (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    serial_number INTEGER NOT NULL,
    name VARCHAR(255) NOT NULL,
    name_english VARCHAR(255) NOT NULL,
    position VARCHAR(50) NOT NULL,
    position_full VARCHAR(255) NOT NULL,
    position_english VARCHAR(255) NOT NULL,
    contact_number VARCHAR(20) NOT NULL,
    branch VARCHAR(100) NOT NULL,
    branch_english VARCHAR(100) NOT NULL,
    remarks TEXT DEFAULT '',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(serial_number)
);

-- Insert sample data
INSERT INTO municipality_wide_agriculture_representatives (
    serial_number, name, name_english, position, position_full, position_english,
    contact_number, branch, branch_english, remarks
) VALUES 
(1, 'शिम कुमारी बुढामगर', 'Shim Kumari Budhamagar', 'ना.प्र.स.', 'नायब प्रशासन सहायक', 'Assistant Administration Officer', '९८४७२५२७०२', 'कृषि', 'Agriculture', ''),
(2, 'पुजना बुढामगर', 'Pujana Budhamagar', 'ना.प्र.स.', 'नायब प्रशासन सहायक', 'Assistant Administration Officer', '९८४८७३६६९१', 'कृषि', 'Agriculture', ''),
(3, 'पबित्रा रोकामगर', 'Pabitra Rokamagar', 'ना.प्र.स.', 'नायब प्रशासन सहायक', 'Assistant Administration Officer', '९८६९५४६२२३', 'कृषि', 'Agriculture', ''),
(4, 'विपना बुढामगर', 'Bipana Budhamagar', 'ना.प्र.स.', 'नायब प्रशासन सहायक', 'Assistant Administration Officer', '९८६८२७१६२०', 'कृषि', 'Agriculture', '')
ON CONFLICT (serial_number) DO NOTHING;
