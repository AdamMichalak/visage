import {
  CollapsibleList,
  List,
  ListItem,
  ListItemLink,
} from '@byteclaw/visage';
import { Link, Match } from '@reach/router';
import React, { ReactNode } from 'react';

interface ListItemRouteLink {
  children: ReactNode;
  to: string;
}

function ListItemRouteLink({ to, ...restProps }: ListItemRouteLink) {
  return (
    <Match path={to}>
      {({ match }) => (
        <ListItemLink active={!!match} as={Link} to={to} {...restProps} />
      )}
    </Match>
  );
}

export function Sidebar() {
  return (
    <List>
      <ListItem>
        <ListItemRouteLink to="/">Introduction</ListItemRouteLink>
      </ListItem>
      <ListItem>
        <ListItemRouteLink to="/">Getting started</ListItemRouteLink>
      </ListItem>
      <ListItem>
        <ListItemRouteLink to="/typography">Typography</ListItemRouteLink>
      </ListItem>
      <ListItem>
        <Match path="/components/*">
          {({ match }) => (
            <CollapsibleList
              collapsed={match == null}
              toggler={<ListItemLink>Components</ListItemLink>}
            >
              <ListItem>
                <ListItemRouteLink to="/components/overview">
                  Overview
                </ListItemRouteLink>
              </ListItem>
              <ListItem>
                <ListItemRouteLink to="/components/box">Box</ListItemRouteLink>
              </ListItem>
            </CollapsibleList>
          )}
        </Match>
      </ListItem>
      <ListItem>
        <ListItemRouteLink to="/">Core</ListItemRouteLink>
      </ListItem>
      <ListItem>
        <ListItemRouteLink to="/">Utilities</ListItemRouteLink>
      </ListItem>
    </List>
  );
}
