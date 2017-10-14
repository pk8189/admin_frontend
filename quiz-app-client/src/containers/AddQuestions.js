import React, { Component } from "react";
import { withRouter } from 'react-router-dom';
import './AddQuestions.css';
import Form from "react-jsonschema-form";
import LoaderButton from '../components/LoaderButton';
import { invokeApig, s3Upload} from '../libs/awsLib';
//import config from '../config.js';

class AddQuestions extends Component {
  constructor(props) {
    super(props);

    this.file = [];

    this.state = {
      isLoading: null,
      isDeleting: null,
      quiz: null,
      category: '',
      quizName: '',
      subject: '',
      image: '',
      questions: '',
    };
  }
  async componentDidMount() {
    try {
      const results = await this.getQuiz();
      this.setState({
        quiz: results,
        category: results.category,
        quizName: results.quizName,
        subject: results.subject,
        image: results.image,
        questions: results.questions
      });
      //console.log(JSON.stringify(this.state.questions));
    }
    catch(e) {
      console.log(e);
      alert(e);
    }
  }
  getQuiz() {
    return invokeApig({ path: `/quizzes1/${this.props.match.params.id}` }, 
    this.props.userToken);
  }
  saveQuiz(quiz) {
    return invokeApig({
      path: `/quizzes1/${this.props.match.params.id}`,
      method: 'PUT',
      body: quiz,
    }, this.props.userToken);
  }

  handleChange = (event) => {
    this.questions = event.formData;
  }

  formatFilename(dataURI) {
    var binary = atob(dataURI.split(',')[1]);
    var array = [];
    for(var i = 0; i < binary.length; i++) {
        array.push(binary.charCodeAt(i));
    }
    return new Blob([new Uint8Array(array)], {type: 'image/jpeg'});
}


  handleSubmit = async (event) => {

    let uploadedFilename;
    let i;
    //var obj = event.formData.Questions[0].Files;
    
    let qs = event.formData.Questions

    let numQuestions = qs.length;
    for (i = 0; i < numQuestions; i++) {
      let image = qs[i].Files;
      if (image != null) {
        let fix = this.formatFilename(image);
        uploadedFilename = (await s3Upload(fix, this.props.userToken)).Location;
      }
    }


    try {
      await this.saveQuiz({
        ...this.state.quiz,
        quizName: this.state.quizName,
        category: this.state.category,
        subject: this.state.subject,
        image: this.state.image,
        questions: this.questions,
      });
      this.props.history.push('/');
    }
    catch(e) {
      alert(e);
      //this.setState({ isLoading: false });
    }
  }



  render() {

    const schema = {
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
    };

const uiSchema = {
  "questions": {
    "items": { 
      "answers": {
        "items": {
        "ui:options": {"orderable": false }
        }
      }
    }
  }
};





const log = (type) => console.log.bind(console, type);
 return (
    <Form className="App"
        schema={schema}
        uiSchema={uiSchema}
        formData={this.state.questions}
        value={this.state.questions}
        onChange={this.handleChange}
        onSubmit={this.handleSubmit}
        onError={log("errors")}
        type='json'
    />
    );
 
  }
}

export default withRouter(AddQuestions);