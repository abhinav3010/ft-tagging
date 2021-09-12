import React, { Component } from "react";
import "./styles.css";

class TaggingRect extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tagInput: "",
    };
    this.inputRef = React.createRef();
  }

  componentDidUpdate(prevProps) {
    const { isEditing } = this.props;
    if (prevProps.rectCoOrdinates !== this.props.rectCoOrdinates && isEditing) {
      this.setState({
        tagInput: "",
      });
      if (this.inputRef.current) {
        this.inputRef.current.focus();
      }
    }
  }

  onInputChange = (event) => {
    this.setState({
      tagInput: event.target.value,
    });
  };

  onInputClick = (event) => {
    event.stopPropagation();
  };

  handleKeyPress = (event) => {
    const keyCode = event.code || event.key;
    if (keyCode === "Enter") {
      const { rectCoOrdinates, onSaveTag } = this.props;
      const { tagInput } = this.state;
      if (!tagInput) {
        return;
      }
      onSaveTag && onSaveTag(rectCoOrdinates, tagInput);
    }
  };

  render() {
    const {
      isEditing,
      rectCoOrdinates: { x, y },
      tagText,
    } = this.props;
    const { tagInput } = this.state;
    return (
      <div
        className="tagging-rect"
        style={{ top: `${y - 50}px`, left: `${x - 40}px` }}
      >
        <div className="tag-window"></div>
        {isEditing ? (
          <input
            autoFocus
            className="tag-input"
            onChange={this.onInputChange}
            value={tagInput}
            ref={this.inputRef}
            onClick={this.onInputClick}
            onKeyPress={this.handleKeyPress}
          />
        ) : (
          <div className="tag-text">{tagText}</div>
        )}
      </div>
    );
  }
}

export default TaggingRect;
