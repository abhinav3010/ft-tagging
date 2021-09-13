import React, { Component, createRef } from "react";
import TaggingRect from "../tagging-rect/index";
import "./styles.css";

class TaggableImage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      taggingEnabled: false,
      rectCoOrdinates: null,
      savedTags: [],
      tagToShow: null,
    };
    this.imgRef = createRef();
  }

  handleTagging = (event) => {
    if (!this.imgRef.current) {
      return;
    }
    const clickX = event.clientX;
    const clickY = event.clientY;
    const imgRect = this.imgRef.current.getBoundingClientRect();
    const imgHeight = imgRect.height;
    const imgWidth = imgRect.width;
    if (
      clickX >= imgRect.left &&
      clickX <= imgRect.left + imgWidth &&
      clickY >= imgRect.top &&
      clickY <= imgRect.top + imgHeight
    ) {
      this.setState({
        rectCoOrdinates: { x: clickX, y: clickY },
      });
    } else {
      this.setState({
        taggingEnabled: false,
        rectCoOrdinates: null,
      });
      window.removeEventListener("click", this.handleTagging);
    }
  };

  onToggleTag = (event) => {
    event.stopPropagation();
    this.setState((state) => {
      if (state.taggingEnabled) {
        window.removeEventListener("click", this.handleTagging);
        return {
          ...state,
          taggingEnabled: false,
          rectCoOrdinates: null,
          tagToDisplay: null,
        };
      } else {
        window.addEventListener("click", this.handleTagging);
        return {
          ...state,
          taggingEnabled: true,
          tagToDisplay: null,
        };
      }
    });
  };

  saveTag = (coOrdinates, tagText) => {
    this.setState((state) => {
      return {
        ...state,
        taggingEnabled: false,
        rectCoOrdinates: null,
        savedTags: [
          ...state.savedTags,
          { rectX: coOrdinates.x, rectY: coOrdinates.y, tagText: tagText },
        ],
      };
    });
    window.removeEventListener("click", this.handleTagging);
  };

  onMouseMoveOverImg = (event) => {
    if (this.state.taggingEnabled === false) {
      const { clientX, clientY } = event;
      const { savedTags } = this.state;
      let tagToDisplay = null;
      for (let i = 0; i < savedTags.length; i++) {
        const { rectX, rectY } = savedTags[i];
        const x = rectX - 40;
        const y = rectY - 50;
        if (
          clientX >= x &&
          clientX <= x + 80 &&
          clientY >= y &&
          clientY <= y + 100
        ) {
          tagToDisplay = savedTags[i];
          break;
        }
      }
      this.setState({
        tagToShow: tagToDisplay,
      });
    }
  };

  renderTagOnHover = () => {
    const { taggingEnabled, tagToShow } = this.state;
    if (taggingEnabled || tagToShow === null) {
      return null;
    }
    const { rectX, rectY, tagText } = tagToShow;
    return (
      <TaggingRect
        rectCoOrdinates={{ x: rectX, y: rectY }}
        isEditing={false}
        tagText={tagText}
      />
    );
  };

  render() {
    const { src } = this.props;
    const { taggingEnabled, rectCoOrdinates } = this.state;
    return (
      <div className="taggable-image">
        <img
          src={src}
          alt=""
          className={`${taggingEnabled ? "tagging-enabled" : ""}`}
          ref={this.imgRef}
          onMouseMove={this.onMouseMoveOverImg}
        />
        <button className="tag-btn" onClick={this.onToggleTag}>
          Add Tag
        </button>
        {rectCoOrdinates ? (
          <TaggingRect
            rectCoOrdinates={rectCoOrdinates}
            isEditing={true}
            onSaveTag={this.saveTag}
          />
        ) : null}
        {this.renderTagOnHover()}
      </div>
    );
  }
}

export default TaggableImage;
