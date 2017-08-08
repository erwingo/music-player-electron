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
  itemSelected?: string;
  onItemDoubleClick?: (item: ListItemProps) => void;
}

export class List extends React.PureComponent<Props, any> {
  render() {
    const items = this.props.items || [];

    return (
      <div className={classnames('list', this.props.className)} style={this.props.style}>
        <h1 className='list__title'>{this.props.title}</h1>
        <div className='list__items'>
          {items.map(item =>
            <ListItem
              key={item.id}
              onDoubleClick={this.props.onItemDoubleClick}
              {...item}
              itemSelected={this.props.itemSelected}
            />
          )}
        </div>
      </div>
    );
  }
}
