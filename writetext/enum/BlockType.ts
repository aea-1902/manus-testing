export const enum BlockTypeEnum{
    H1_Product_Title = 'H1 / Product title',
    Subtitle_Tagline = 'Subtitle or tagline',
    Introduction = 'Introduction',
    Features = 'Features',
    
}

export const enum BlockPropertyGroupEnum{
    h1_content = 'h1_content',
    spacing = 'spacing',
    formatting = 'formatting',
    target_length = 'target_length',
    section_heading = 'section_heading',
    structure = 'structure',
}

export const enum BlockPropertyTypeEnum{
    Checkbox = "Checkbox",
    Dropdown = "Dropdown",
    SingleSelectOption = "SingleSelectOption",
    MultiSelectOption = "MultiSelectOption",
    TextField = "TextField",
    NumberField = "NumberField",
    MultilineTextField = "MultiLineTextField",
    None = "None"
}

export const enum BlockMessagesEnum{
    H1_Alert = 'Before adding an H1 to your template, check if the product page already includes one (e.g., product title). Multiple H1 tags can negatively impact SEO.',
    H1_Alert_Category = 'Before adding an H1 to your template, check if the category page already includes one (e.g., category title). Multiple H1 tags can negatively impact SEO.',
    Heading_Error = 'The heading level you selected may be out of order. Skipping levels can confuse search engines and impact SEO. Use a clear, logical order to help with both readability and ranking.',
    Image_Alert = 'WriteText.ai keeps the order of the image you selected when you start generating text.',
    Image_Include_Warning = 'This image is already used in another block. Please consider selecting a different one.',
    Min_Max_Error = 'Min and Max cannot be equal.'
    // Image_Alert = '<b>Option 1 – Generating Text</b>\nWriteText.ai randomly selects an image (excluding the primary image) from the product\'s associated images during text generation.\n\n<b>Option 2 – Regenerating Text</b>\nWhen regenerating text, WriteText.ai retains the same images in their original order if present; otherwise, it defaults to Option 1.',
}