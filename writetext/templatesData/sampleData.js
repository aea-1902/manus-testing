export const sampleData = [
  {
    "templateName": "Page title templates",
    "templates": [
      {
        "id": 1,
        "name": "template 1",
        "webshops": [
          {
            "url": "url1",
            "name": "webshop 1"
          },
          {
            "url": "url2",
            "name": "webshop 2"
          }
        ]
      },
      {
        "id": 2,
        "name": "template 2",
        "webshops": [
          {
            "url": "url3",
            "name": "webshop 3"
          }
        ]
      }
    ]
  },
  {
    "templateName": "Product description templates",
    "templates": [
      {
        "id": 1,
        "name": "template 1",
        "webshops": [
          {
            "url": "url1",
            "name": "webshop 1"
          }
        ]
      }
    ]
  },
  {
    "templateName": "Product excerpt templates",
    "templates": []
  }
];

//copy sampleTemplateObjects from pages/Templates/index.js and paste here

export const productDescriptionExcerptTemplate = [
    {
      "title": "",
      "template": "Page description/excerpt",
      "blocks": [
        {
          "sortable": false,
          "enabled": false,
          "id": "title",
          "label": "Product title (H1)",
          "errorMessage": "",
          "groups": [
            {
              "group_id": "h1_content",
              "group_label": "H1 content",
              "properties": [
                {
                  "id": "content",
                  "label": "Content",
                  "type": "Dropdown",
                  "options": [
                    {"id" : "generate", "text": "Generate using WriteText.ai "},
                    {"id" : "use_product", "text": "Use product name only"}
                  ],
                  "values": ["use_product"],
                  "defaultValues": ["use_product"]
                }
              ]
            },
            {
              "group_id": "spacing",
              "group_label": "Spacing before the next block",
              "properties": [
                {
                  "id": "spacing",
                  "label": "Spacing before the next block",
                  "type": "Dropdown",
                  "options": [
                    {
                      "id": "paragraph",
                      "text": "Paragraph"
                    },
                    {
                      "id": "n_lines",
                      "text": "[N] lines"
                    }
                  ],
                  "values": [],
                  "defaultValues": []
                },
                {
                  "id": "spacing_lines",
                  "label": "",
                  "type": "Number field",
                  "options": [],
                  "values": ["2"],
                  "defaultValues": ["2"]
                }
              ]
            }
          ]
        },
        {
          "sortable": false,
          "enabled": false,
          "id": "subtitle",
          "label": "Subtitle or tagline",
          "errorMessage": "",
          "groups": [
            {
              "group_id": "formatting",
              "group_label": "Paragraph/Text formatting",
              "properties": [
                {
                  "id": "formatting",
                  "label": "Text formatting",
                  "type": "Multi-select option",
                  "options": [
                    {
                      "id": "bold",
                      "text": "B"
                    },
                    {
                      "id": "italic",
                      "text": "I"
                    },
                    {
                      "id": "underline",
                      "text": "U"
                    }
                  ],
                  "values": [],
                  "defaultValues": []
                }
              ]
            },
            {
              "group_id": "spacing",
              "group_label": "Spacing before the next block",
              "properties": [
                {
                  "id": "spacing",
                  "label": "Spacing before the next block",
                  "type": "Dropdown",
                  "options": [
                    {
                      "id": "paragraph",
                      "text": "Paragraph"
                    },
                    {
                      "id": "n_lines",
                      "text": "[N] lines"
                    }
                  ],
                  "values": [
                    
                  ],
                  "defaultValues": [
                    
                  ]
                },
                {
                  "id": "spacing_lines",
                  "label": "",
                  "type": "Number field",
                  "options": [],
                  "values": ["2"],
                  "defaultValues": ["2"]
                }
              ]
            }
          ]
        },
        {
          "sortable": true,
          "enabled": false,
          "id": "introduction",
          "label": "Introduction",
          "errorMessage": "",
          "groups": [{
            "group_id": "target_length",
            "group_label": "Target length (in words)",
            "properties": [
              {
                "id": "min",
                "label": "Min",
                "type": "Number field",
                "options": [],
                "values": ["40"],
                "defaultValues": ["40"]
              },
              {
                "id": "max",
                "label": "Max",
                "type": "Number field",
                "options": [],
                "values": ["80"],
                "defaultValues": ["80"]
              }
            ]
          }
          ,
          {
            "group_id": "section_heading",
            "group_label": "Section heading",
            "properties": [
              {
                "id": "heading_text",
                "label": "Section heading (part 1)",
                "type": "Dropdown",
                "options": [
                  {"id":"none","text":"None"},
                  {"id" : "generate", "text": "Generate using WriteText.ai "},
                  {"id" : "custom", "text": "Custom text"}
                ],
                "values": [],
                "defaultValues": []
              },
              {
                "id": "heading_text_custom",
                "label": "",
                "type": "Text field",
                "options": [],
                "values": [],
                "defaultValues": []
              },
              {
                "id": "heading_text_tag",
                "label": "Section heading (part 2)",
                "type": "Single-select option",
                "options": [{"id": "h2", "text": "H2"}, {"id": "h3", "text": "H3"}, {"id": "h4", "text": "H4"}, {"id": "h5", "text": "H5"}, {"id": "h6", "text": "H6"}],
                "values": [],
                "defaultValues": []
              }
            ]
          },{
            "group_id": "formatting",
            "group_label": "Paragraph/Text formatting",
            "properties": [
              {
                "id": "formatting",
                "label": "Text formatting",
                "type": "Multi-select option",
                "options": [
                  {
                    "id": "bold",
                    "text": "B"
                  },
                  {
                    "id": "italic",
                    "text": "I"
                  },
                  {
                    "id": "underline",
                    "text": "U"
                  }
                ],
                "values": [],
                "defaultValues": []
              }
            ]
          },
          {
            "group_id": "spacing",
            "group_label": "Spacing before the next block",
            "properties": [
              {
                "id": "spacing",
                "label": "Spacing before the next block",
                "type": "Dropdown",
                "options": [
                  {
                    "id": "paragraph",
                    "text": "Paragraph"
                  },
                  {
                    "id": "n_lines",
                    "text": "[N] lines"
                  }
                ],
                "values": [
                  
                ],
                "defaultValues": [
                  
                ]
              },
              {
                "id": "spacing_lines",
                "label": "",
                "type": "Number field",
                "options": [],
                "values": ["2"],
                "defaultValues": ["2"]
              }
            ]
          }
        ]
        },
        {
          "sortable": true,
          "enabled": false,
          "id": "features",
          "label": "Features",
          "errorMessage": "",
          "groups": [{
            "group_id": "target_length",
            "group_label": "Target length (in words)",
            "properties": [
              {
                "id": "min",
                "label": "Min",
                "type": "Number field",
                "options": [],
                "values": ["40"],
                "defaultValues": ["40"]
              },
              {
                "id": "max",
                "label": "Max",
                "type": "Number field",
                "options": [],
                "values": ["80"],
                "defaultValues": ["80"]
              }
            ]
          }
          ,
          {
            "group_id": "section_heading",
            "group_label": "Section heading",
            "properties": [
              {
                "id": "heading_text",
                "label": "Section heading (part 1)",
                "type": "Dropdown",
                "options": [
                  {"id":"none","text":"None"},
                  {"id" : "generate", "text": "Generate using WriteText.ai "},
                  {"id" : "custom", "text": "Custom text"}
                ],
                "values": [],
                "defaultValues": []
              },
              {
                "id": "heading_text_custom",
                "label": "",
                "type": "Text field",
                "options": [],
                "values": [],
                "defaultValues": []
              },
              {
                "id": "heading_text_tag",
                "label": "Section heading (part 2)",
                "type": "Single-select option",
                "options": [{"id": "h2", "text": "H2"}, {"id": "h3", "text": "H3"}, {"id": "h4", "text": "H4"}, {"id": "h5", "text": "H5"}, {"id": "h6", "text": "H6"}],
                "values": [],
                "defaultValues": []
              }
            ]
          },
          {
            "group_id": "structure",
            "group_label": "Text formatting",
            "properties": [
              {
                "id": "structure",
                "label": "Text structure",
                "type": "Single-select option",
                "options": [{"id": "paragraph", "text": "Paragraph"}, {"id": "bullet_list", "text": "Bullet list"}, {"id": "number_list", "text": "Number list"}],
                "values": [],
                "defaultValues": []

              }
            ]
          },{
            "group_id": "formatting",
            "group_label": "Paragraph/Text formatting",
            "properties": [
              {
                "id": "formatting",
                "label": "Text formatting",
                "type": "Multi-select option",
                "options": [
                  {
                    "id": "bold",
                    "text": "B"
                  },
                  {
                    "id": "italic",
                    "text": "I"
                  },
                  {
                    "id": "underline",
                    "text": "U"
                  }
                ],
                "values": [],
                "defaultValues": []
              }
            ]
          },
          {
            "group_id": "spacing",
            "group_label": "Spacing before the next block",
            "properties": [
              {
                "id": "spacing",
                "label": "Spacing before the next block",
                "type": "Dropdown",
                "options": [
                  {
                    "id": "paragraph",
                    "text": "Paragraph"
                  },
                  {
                    "id": "n_lines",
                    "text": "[N] lines"
                  }
                ],
                "values": [
                  
                ],
                "defaultValues": [
                  
                ]
              },
              {
                "id": "spacing_lines",
                "label": "",
                "type": "Number field",
                "options": [],
                "values": ["2"],
                "defaultValues": ["2"]
              }
            ]
          }
        ]
        },
        {
          "sortable": true,
          "enabled": false,
          "id": "benefits",
          "label": "Benefits",
          "errorMessage": "",
          "groups": [{
            "group_id": "target_length",
            "group_label": "Target length (in words)",
            "properties": [
              {
                "id": "min",
                "label": "Min",
                "type": "Number field",
                "options": [],
                "values": ["40"],
                "defaultValues": ["40"]
              },
              {
                "id": "max",
                "label": "Max",
                "type": "Number field",
                "options": [],
                "values": ["80"],
                "defaultValues": ["80"]
              }
            ]
          }
          ,
          {
            "group_id": "section_heading",
            "group_label": "Section heading",
            "properties": [
              {
                "id": "heading_text",
                "label": "Section heading (part 1)",
                "type": "Dropdown",
                "options": [
                  {"id":"none","text":"None"},
                  {"id" : "generate", "text": "Generate using WriteText.ai "},
                  {"id" : "custom", "text": "Custom text"}
                ],
                "values": [],
                "defaultValues": []
              },
              {
                "id": "heading_text_custom",
                "label": "",
                "type": "Text field",
                "options": [],
                "values": [],
                "defaultValues": []
              },
              {
                "id": "heading_text_tag",
                "label": "Section heading (part 2)",
                "type": "Single-select option",
                "options": [{"id": "h2", "text": "H2"}, {"id": "h3", "text": "H3"}, {"id": "h4", "text": "H4"}, {"id": "h5", "text": "H5"}, {"id": "h6", "text": "H6"}],
                "values": [],
                "defaultValues": []
              }
            ]
          },
          {
            "group_id": "structure",
            "group_label": "Text formatting",
            "properties": [
              {
                "id": "structure",
                "label": "Text structure",
                "type": "Single-select option",
                "options": [{"id": "paragraph", "text": "Paragraph"}, {"id": "bullet_list", "text": "Bullet list"}, {"id": "number_list", "text": "Number list"}],
                "values": [],
                "defaultValues": []

              }
            ]
          },{
            "group_id": "formatting",
            "group_label": "Paragraph/Text formatting",
            "properties": [
              {
                "id": "formatting",
                "label": "Text formatting",
                "type": "Multi-select option",
                "options": [
                  {
                    "id": "bold",
                    "text": "B"
                  },
                  {
                    "id": "italic",
                    "text": "I"
                  },
                  {
                    "id": "underline",
                    "text": "U"
                  }
                ],
                "values": [],
                "defaultValues": []
              }
            ]
          },
          {
            "group_id": "spacing",
            "group_label": "Spacing before the next block",
            "properties": [
              {
                "id": "spacing",
                "label": "Spacing before the next block",
                "type": "Dropdown",
                "options": [
                  {
                    "id": "paragraph",
                    "text": "Paragraph"
                  },
                  {
                    "id": "n_lines",
                    "text": "[N] lines"
                  }
                ],
                "values": [
                  
                ],
                "defaultValues": [
                  
                ]
              },
              {
                "id": "spacing_lines",
                "label": "",
                "type": "Number field",
                "options": [],
                "values": ["2"],
                "defaultValues": ["2"]
              }
            ]
          }
        ]
        },
        {
          "sortable": true,
          "enabled": false,
          "id": "technical_specifications",
          "label": "Technical specifications",
          "errorMessage": "",
          "groups": [{
            "group_id": "target_length",
            "group_label": "Target length (in words)",
            "properties": [
              {
                "id": "min",
                "label": "Min",
                "type": "Number field",
                "options": [],
                "values": ["40"],
                "defaultValues": ["40"]
              },
              {
                "id": "max",
                "label": "Max",
                "type": "Number field",
                "options": [],
                "values": ["80"],
                "defaultValues": ["80"]
              }
            ]
          }
          ,
          {
            "group_id": "section_heading",
            "group_label": "Section heading",
            "properties": [
              {
                "id": "heading_text",
                "label": "Section heading (part 1)",
                "type": "Dropdown",
                "options": [
                  {"id":"none","text":"None"},
                  {"id" : "generate", "text": "Generate using WriteText.ai "},
                  {"id" : "custom", "text": "Custom text"}
                ],
                "values": [],
                "defaultValues": []
              },
              {
                "id": "heading_text_custom",
                "label": "",
                "type": "Text field",
                "options": [],
                "values": [],
                "defaultValues": []
              },
              {
                "id": "heading_text_tag",
                "label": "Section heading (part 2)",
                "type": "Single-select option",
                "options": [{"id": "h2", "text": "H2"}, {"id": "h3", "text": "H3"}, {"id": "h4", "text": "H4"}, {"id": "h5", "text": "H5"}, {"id": "h6", "text": "H6"}],
                "values": [],
                "defaultValues": []
              }
            ]
          },
          {
            "group_id": "structure",
            "group_label": "Text formatting",
            "properties": [
              {
                "id": "structure",
                "label": "Text structure",
                "type": "Single-select option",
                "options": [{"id": "paragraph", "text": "Paragraph"}, {"id": "bullet_list", "text": "Bullet list"}, {"id": "number_list", "text": "Number list"}],
                "values": [],
                "defaultValues": []

              }
            ]
          },{
            "group_id": "formatting",
            "group_label": "Paragraph/Text formatting",
            "properties": [
              {
                "id": "formatting",
                "label": "Text formatting",
                "type": "Multi-select option",
                "options": [
                  {
                    "id": "bold",
                    "text": "B"
                  },
                  {
                    "id": "italic",
                    "text": "I"
                  },
                  {
                    "id": "underline",
                    "text": "U"
                  }
                ],
                "values": [],
                "defaultValues": []
              }
            ]
          },
          {
            "group_id": "spacing",
            "group_label": "Spacing before the next block",
            "properties": [
              {
                "id": "spacing",
                "label": "Spacing before the next block",
                "type": "Dropdown",
                "options": [
                  {
                    "id": "paragraph",
                    "text": "Paragraph"
                  },
                  {
                    "id": "n_lines",
                    "text": "[N] lines"
                  }
                ],
                "values": [
                  
                ],
                "defaultValues": [
                  
                ]
              },
              {
                "id": "spacing_lines",
                "label": "",
                "type": "Number field",
                "options": [],
                "values": ["2"],
                "defaultValues": ["2"]
              }
            ]
          }
        ]
        },
        {
          "sortable": true,
          "enabled": false,
          "id": "faqs",
          "label": "FAQs",
          "errorMessage": "",
          "groups": [{
            "group_id": "target_length",
            "group_label": "Target length (in words)",
            "properties": [
              {
                "id": "min",
                "label": "Min",
                "type": "Number field",
                "options": [],
                "values": ["40"],
                "defaultValues": ["40"]
              },
              {
                "id": "max",
                "label": "Max",
                "type": "Number field",
                "options": [],
                "values": ["80"],
                "defaultValues": ["80"]
              }
            ]
          }
          ,
          {
            "group_id": "section_heading",
            "group_label": "Section heading",
            "properties": [
              {
                "id": "heading_text",
                "label": "Section heading (part 1)",
                "type": "Dropdown",
                "options": [
                  {"id":"none","text":"None"},
                  {"id" : "generate", "text": "Generate using WriteText.ai "},
                  {"id" : "custom", "text": "Custom text"}
                ],
                "values": [],
                "defaultValues": []
              },
              {
                "id": "heading_text_custom",
                "label": "",
                "type": "Text field",
                "options": [],
                "values": [],
                "defaultValues": []
              },
              {
                "id": "heading_text_tag",
                "label": "Section heading (part 2)",
                "type": "Single-select option",
                "options": [{"id": "h2", "text": "H2"}, {"id": "h3", "text": "H3"}, {"id": "h4", "text": "H4"}, {"id": "h5", "text": "H5"}, {"id": "h6", "text": "H6"}],
                "values": [],
                "defaultValues": []
              }
            ]
          },
          {
            "group_id": "structure",
            "group_label": "Text formatting",
            "properties": [
              {
                "id": "structure",
                "label": "Text structure",
                "type": "Single-select option",
                "options": [{"id": "paragraph", "text": "Paragraph"}, {"id": "bullet_list", "text": "Bullet list"}, {"id": "number_list", "text": "Number list"}],
                "values": [],
                "defaultValues": []

              }
            ]
          },{
            "group_id": "formatting",
            "group_label": "Paragraph/Text formatting",
            "properties": [
              {
                "id": "formatting",
                "label": "Text formatting",
                "type": "Multi-select option",
                "options": [
                  {
                    "id": "bold",
                    "text": "B"
                  },
                  {
                    "id": "italic",
                    "text": "I"
                  },
                  {
                    "id": "underline",
                    "text": "U"
                  }
                ],
                "values": [],
                "defaultValues": []
              }
            ]
          },
          {
            "group_id": "spacing",
            "group_label": "Spacing before the next block",
            "properties": [
              {
                "id": "spacing",
                "label": "Spacing before the next block",
                "type": "Dropdown",
                "options": [
                  {
                    "id": "paragraph",
                    "text": "Paragraph"
                  },
                  {
                    "id": "n_lines",
                    "text": "[N] lines"
                  }
                ],
                "values": [
                  
                ],
                "defaultValues": [
                  
                ]
              },
              {
                "id": "spacing_lines",
                "label": "",
                "type": "Number field",
                "options": [],
                "values": ["2"],
                "defaultValues": ["2"]
              }
            ]
          }
        ]
        },
        {
          "sortable": true,
          "enabled": false,
          "id": "call_to_action_conclusion",
          "label": "Call-to-action / Conclusion",
          "errorMessage": "",
          "groups": [{
            "group_id": "target_length",
            "group_label": "Target length (in words)",
            "properties": [
              {
                "id": "min",
                "label": "Min",
                "type": "Number field",
                "options": [],
                "values": ["40"],
                "defaultValues": ["40"]
              },
              {
                "id": "max",
                "label": "Max",
                "type": "Number field",
                "options": [],
                "values": ["80"],
                "defaultValues": ["80"]
              }
            ]
          }
          ,
          {
            "group_id": "section_heading",
            "group_label": "Section heading",
            "properties": [
              {
                "id": "heading_text",
                "label": "Section heading (part 1)",
                "type": "Dropdown",
                "options": [
                  {"id":"none","text":"None"},
                  {"id" : "generate", "text": "Generate using WriteText.ai "},
                  {"id" : "custom", "text": "Custom text"}
                ],
                "values": [],
                "defaultValues": []
              },
              {
                "id": "heading_text_custom",
                "label": "",
                "type": "Multi-line text field",
                "options": [],
                "values": [],
                "defaultValues": []
              },
              {
                "id": "heading_text_tag",
                "label": "Section heading (part 2)",
                "type": "Single-select option",
                "options": [{"id": "h2", "text": "H2"}, {"id": "h3", "text": "H3"}, {"id": "h4", "text": "H4"}, {"id": "h5", "text": "H5"}, {"id": "h6", "text": "H6"}],
                "values": [],
                "defaultValues": []
              }
            ]
          },
          {
            "group_id": "structure",
            "group_label": "Text formatting",
            "properties": [
              {
                "id": "structure",
                "label": "Text structure",
                "type": "Single-select option",
                "options": [{"id": "paragraph", "text": "Paragraph"}, {"id": "bullet_list", "text": "Bullet list"}, {"id": "number_list", "text": "Number list"}],
                "values": [],
                "defaultValues": []

              }
            ]
          },{
            "group_id": "formatting",
            "group_label": "Paragraph/Text formatting",
            "properties": [
              {
                "id": "formatting",
                "label": "Text formatting",
                "type": "Multi-select option",
                "options": [
                  {
                    "id": "bold",
                    "text": "B"
                  },
                  {
                    "id": "italic",
                    "text": "I"
                  },
                  {
                    "id": "underline",
                    "text": "U"
                  }
                ],
                "values": [],
                "defaultValues": []
              }
            ]
          },
          {
            "group_id": "spacing",
            "group_label": "Spacing before the next block",
            "properties": [
              {
                "id": "spacing",
                "label": "Spacing before the next block",
                "type": "Dropdown",
                "options": [
                  {
                    "id": "paragraph",
                    "text": "Paragraph"
                  },
                  {
                    "id": "n_lines",
                    "text": "[N] lines"
                  }
                ],
                "values": [
                  
                ],
                "defaultValues": [
                  
                ]
              },
              {
                "id": "spacing_lines",
                "label": "",
                "type": "Number field",
                "options": [],
                "values": ["2"],
                "defaultValues": ["2"]
              }
            ]
          }
        ]
        }
      ]
    }
  ]
