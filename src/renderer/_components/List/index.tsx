import * as classnames from 'classnames';
import * as _ from 'lodash';
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
  rowToScroll?: number | string;
}

export class List extends React.PureComponent<Props, any> {
  scrollToRow() {
    if (typeof this.props.rowToScroll === 'undefined') { return; }

    const listItemsContainer = this.refs.listItemsContainer as HTMLElement;
    const listItem = listItemsContainer.childNodes[0] as HTMLElement | undefined;

    if (!listItem) { return; }
    const rowToScroll = this.props.rowToScroll;
    const itemHeight = listItem.offsetHeight;
    let idx = typeof rowToScroll === 'number' ?
      rowToScroll :
      _.findIndex(this.props.items, el => el.id === rowToScroll);

    idx -= 4;
    if (idx >= 0) { listItemsContainer.scrollTop = idx * itemHeight; }
  }

  render() {
    const items = this.props.items || [];
    this.scrollToRow();

    return (
      <div
        className={classnames('list', this.props.className)}
        style={this.props.style}
      >
        <h1 className='list__title'>{this.props.title}</h1>
        <div className='list__items' ref='listItemsContainer'>
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
