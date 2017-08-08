import * as classnames from 'classnames';
import * as React from 'react';
import './index.scss';

export interface ActiveEls {
  sectionHighlightedId?: string;
  sectionItemHighlightedId?: string;
  sectionSelectedId?: string;
  sectionItemSelectedId?: string;
}

interface Props {
  className?: string;
  onSectionItemClick?: (sectionId: string, itemId: string) => void;
  onSectionItemDblClick?: (sectionId: string, itemId: string) => void;
  activeEls: ActiveEls;
  sections: {
    id: string;
    title: string;
    items: { id: string; title: string; }[]
  }[];
}

export class Sidebar extends React.PureComponent<Props, any> {
  constructor() {
    super();
    this.handleClick = this.handleClick.bind(this);
    this.handleDblClick = this.handleDblClick.bind(this);
  }

  handleClick(sectionId: string, itemId: string) {
    return () =>
      this.props.onSectionItemClick && this.props.onSectionItemClick(sectionId, itemId);
  }

  handleDblClick(sectionId: string, itemId: string) {
    return () =>
      this.props.onSectionItemDblClick && this.props.onSectionItemDblClick(sectionId, itemId);
  }
  render() {
    const props = this.props;

    return (
      <div className={classnames('sidebar', props.className)}>
        {props.sections.map(section =>
          <div key={section.id} className='sidebar__section'>
            <p className='sidebar__section__title'>{section.title}</p>
            <div className='sidebar__section__items'>
              {section.items.map(item =>
                <div
                  key={item.id}
                  className={classnames(
                    'sidebar__section__items__item',
                    {
                      'is-highlighted': props.activeEls.sectionHighlightedId === section.id
                        && props.activeEls.sectionItemHighlightedId === item.id,
                      'is-selected': props.activeEls.sectionSelectedId === section.id
                        && props.activeEls.sectionItemSelectedId === item.id
                    }
                  )}
                  onDoubleClick={this.handleDblClick(section.id, item.id)}
                  onClick={this.handleClick(section.id, item.id)}
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
