import React, { Component } from "react";

interface MousePosition {
  x: number;
  y: number;
}

interface MouseTrackerProps {
  render: (state: MousePosition) => React.ReactNode;
}

class MouseTracker extends Component<MouseTrackerProps, MousePosition> {
  constructor(props: MouseTrackerProps) {
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
        {this.props.render(this.state)}
      </div>
    );
  }
}

export default MouseTracker;
