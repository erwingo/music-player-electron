import * as classnames from 'classnames';
import * as React from 'react';
import { getBgImgUrl } from '../../_helpers';

export interface Props {
  id: string;
  title: string;
  desc?: string;
  imgUrl?: string;
  itemSelected?: string;
  onDoubleClick?: (item: Props) => void;
  onContextMenu?: (item: Props) => void;
}

export class ListItem extends React.PureComponent<Props, any> {
  constructor() {
    super();
    this.handleDoubleClick = this.handleDoubleClick.bind(this);
    this.handleContextMenu = this.handleContextMenu.bind(this);
  }

  handleDoubleClick() {
    if (this.props.onDoubleClick) { this.props.onDoubleClick(this.props); }
  }

  handleContextMenu() {
    if (this.props.onContextMenu) { this.props.onContextMenu(this.props); }
  }

  render() {
    return (
      <div
        onDoubleClick={this.handleDoubleClick}
        onContextMenu={this.handleContextMenu}
        className={classnames('list__item', {
          'is-selected': this.props.id === this.props.itemSelected
        })}
      >
        <div
          className='list__item__img'
          style={{ backgroundImage: getBgImgUrl(this.props.imgUrl) }}
        />
        <div className='list__item__content'>
          <div className='list__item__title'>{this.props.title}</div>
          <div className='list__item__subtitle'>{this.props.desc || '-'}</div>
        </div>
      </div>
    );
  }
}
