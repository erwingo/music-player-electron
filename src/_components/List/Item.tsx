import * as React from 'react';
import { getBgImgUrl } from '../../_helpers';

export interface Props {
  id: string;
  title: string;
  desc?: string;
  imgUrl?: string;
  onDoubleClick?: (item: Props) => void;
}

export function ListItem(props: Props) {
  function handleDoubleClick() {
    if (props.onDoubleClick) { props.onDoubleClick(props); }
  }

  return (
    <div key={props.id} className='list__item' onDoubleClick={handleDoubleClick}>
      <div
        className='list__item__img'
        style={{ backgroundImage: getBgImgUrl(props.imgUrl) }}
      />
      <div className='list__item__content'>
        <div className='list__item__title'>{props.title}</div>
        <div className='list__item__subtitle'>{props.desc || '-'}</div>
      </div>
    </div>
  );
}
