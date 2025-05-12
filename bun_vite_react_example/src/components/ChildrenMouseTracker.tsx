import React, { Component } from "react";

interface MousePosition {
  x: number;
  y: number;
}

interface ChildrenMouseTrackerProps {
  children: (state: MousePosition) => React.ReactNode;
}

class ChildrenMouseTracker extends Component<
  ChildrenMouseTrackerProps,
  MousePosition
> {
  constructor(props: ChildrenMouseTrackerProps) {
    super(props);
    this.state = { x: 0, y: 0 };
  }

  handleMouseMove = (event: React.MouseEvent) => {
    this.setState({
      x: event.clientX,
      y: event.clientY,
    });
  };

  render() {
    return (
      <div style={{ height: "100vh" }} onMouseMove={this.handleMouseMove}>
        {this.props.children(this.state)}
      </div>
    );
  }
}

export default ChildrenMouseTracker;
