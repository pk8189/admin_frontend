import React from 'react';
import { Route, Switch } from 'react-router-dom';
import NotFound from './containers/NotFound';
import AppliedRoute from './components/AppliedRoute';
import Home from './containers/Home';
import Login from './containers/Login';
import NewQuiz from './containers/NewQuiz';
import AuthenticatedRoute from './components/AuthenticatedRoute';
import UnauthenticatedRoute from './components/UnauthenticatedRoute';
import Quizzes from './containers/Quizzes'
import AddQuestions from './containers/AddQuestions'

export default ({ childProps }) => (
  <Switch>
    <AppliedRoute path="/" exact component={Home} props={childProps} />
    <UnauthenticatedRoute path="/login" exact component={Login} props={childProps} />
    <AuthenticatedRoute path="/quiz/new" exact component={NewQuiz} props={childProps} />
    <AuthenticatedRoute path="/quiz/questions/:id" exact component={AddQuestions} props={childProps} />
    <AuthenticatedRoute path="/quiz/:id" exact component={Quizzes} props={childProps} />
    { /* Finally, catch all unmatched routes */ }
    <Route component={NotFound} />
  </Switch>
);