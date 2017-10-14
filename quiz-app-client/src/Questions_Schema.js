
schema: = {
  "type": "object",

  "properties": {
    "Questions": {
      "type": "array",
      "items": {
      "type": "object",

        "properties": {
          "title": {
            "type": "string",
            "title": "Question",
            "description": "Add Question"
          },
          "Answers": {

            "type": "array",
            "items": {
            "type": "object",
                
                "properties": {
                    "answer": {
                        "type": "string"
                    },
                    "correct": {
                        "type": "boolean",
                        "title": "Correct"
                    }
                }
            }

          },
          "Files": {
            "type": "string",
            "format": "data-url",
            "title": "Image"
          }

        }
      }
    }
  }
},

 uiSchema: {
  "questions": {
    "items": { 
      "answers": {
        "items": {
        "ui:options": {"orderable": false }
        }
    }
  }
}

},


 formData:{
}
