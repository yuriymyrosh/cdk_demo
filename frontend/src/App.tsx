import React from 'react';
import './App.css';
import { UsersTable } from './pages/Users/UsersTable/UsersTable';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Users } from './pages/Users/Users';
import { UserEdit } from './pages/Users/UserEdit/UserEdit';
import { UserCreate } from './pages/Users/UserCreate/UserCreate';
import { ApolloClient, ApolloLink, ApolloProvider, HttpLink, InMemoryCache } from '@apollo/client';
import config from './cdk-exports.json';
import { createAuthLink } from 'aws-appsync-auth-link';
import { createSubscriptionHandshakeLink } from 'aws-appsync-subscription-link';

export interface ChildRoute {
  index?: boolean;
  link?: string;
  component: JSX.Element;
}

export interface RouteObject {
  link: string;
  component: JSX.Element;
  children?: ChildRoute[];
}

function App() {
  const region = 'eu-central';
  const url = config.BackendStack.awsappsyncgraphqlEndpoint;
  const auth: {type: 'API_KEY', apiKey: string} = {
    type: 'API_KEY',
    apiKey: config.BackendStack.awsappsyncapiKey,
  };

  const httpLink = new HttpLink({ uri: url });
  const link = ApolloLink.from([
    createAuthLink({ url, region, auth }),
    createSubscriptionHandshakeLink({ url, region, auth }, httpLink),
  ]);

  const client = new ApolloClient({
    link,
    cache: new InMemoryCache(),
  });

  const routes: RouteObject[] = [
    {
      link: '',
      component: <Users/>,
      children: [
        {
          index: true,
          component: <UsersTable/>
        },
        {
          link: ':id',
          component: <UserEdit/>
        },
        {
          link: 'new',
          component: <UserCreate/>
        }
      ]
    }
  ];

  return (
    <ApolloProvider client={client}>
      <Router>
        <Routes>
          {routes.map((route) => (
            <Route
              path={route.link}
              key={route.link}
              element={route.component}
            >
              {route.children?.length && route.children.map((child: ChildRoute) => {
                if (child.index) {
                  return <Route index element={child.component} key={`${route.link}index`}/>
                } else {
                  return <Route path={child.link} element={child.component} key={`${route.link}${child.link}`}/>
                }
              })}
            </Route>
          ))}
        </Routes>
      </Router>
    </ApolloProvider>
  )
}

export default App;
