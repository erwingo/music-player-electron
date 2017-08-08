import * as classnames from 'classnames';
import * as React from 'react';
import { getBgImgUrl } from '../../_helpers';
import './index.scss';
import { ListItem, Props as ListItemProps } from './Item';

export interface ListItemProps extends ListItemProps {}

interface Props {
  className?: string;
  style?: object;
  title: string;
  items?: ListItemProps[];
  onItemDoubleClick?: (item: ListItemProps) => void;
}

export function List(props: Props) {
  const items = props.items || [];

  return (
    <div className={classnames('list', props.className)} style={props.style}>
      <h1 className='list__title'>{props.title}</h1>
      <div className='list__items'>
        {items.map(item =>
          <ListItem
            key={item.id}
            onDoubleClick={props.onItemDoubleClick}
            {...item}
          />
        )}
      </div>
    </div>
  );
}
