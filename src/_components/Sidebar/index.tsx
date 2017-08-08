import * as classnames from 'classnames';
import * as React from 'react';
import './index.scss';

interface Props {
  className?: string;
  onSectionItemClick?: (sectionId: string, itemId: string) => void;
  onSectionItemDblClick?: (sectionId: string, itemId: string) => void;
  sections: {
    id: string;
    title: string;
    items: { id: string; title: string; }[]
  }[];
}

export class Sidebar extends React.PureComponent<Props, any> {
  render() {
    const props = this.props;

    function handleClick(sectionId: string, itemId: string) {
      return () =>
        props.onSectionItemClick && props.onSectionItemClick(sectionId, itemId);
    }

    function handleDoubleClick(sectionId: string, itemId: string) {
      return () =>
        props.onSectionItemDblClick && props.onSectionItemDblClick(sectionId, itemId);
    }

    return (
      <div className={classnames('sidebar', props.className)}>
        {props.sections.map(section =>
          <div key={section.id} className='sidebar__section'>
            <p className='sidebar__section__title'>{section.title}</p>
            <div className='sidebar__section__items'>
              {section.items.map(item =>
                <div
                  key={item.id}
                  className='sidebar__section__items__item'
                  onDoubleClick={handleDoubleClick(section.id, item.id)}
                  onClick={handleClick(section.id, item.id)}
                >
                  {item.title}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }
}
