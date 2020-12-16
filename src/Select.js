import React, { PureComponent } from "react";
import * as PropTypes from "prop-types";
import {
  Dimensions,
  FlatList,
  Modal,
  Text,
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  TouchableOpacity
} from "react-native";

const colors = {
  white: "#FFFFFF",
  black: "#000000",
  border: "#BBBBBB",
}
const styles = StyleSheet.create({
  container: {
    position: "relative",
    width: "100%"
  },
  current: {
    width: "100%",
    height: 50,
    lineHeight: 50,
    justifyContent: "center",
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    borderRadius: 4,
    fontSize: 16
  },
  arrow: {
    position: "absolute",
    top: 13,
    right: 16
  },
  option: {
    width: "100%",
    height: 49,
    lineHeight: 49,
    justifyContent: "center",
    paddingHorizontal: 10,
    backgroundColor: colors.white,
    fontSize: 16
  },
  separator: {
    width: "100%",
    height: 1,
    backgroundColor: colors.border
  },
  modal: {
    width: "100%",
    height: "100%"
  },
  modalBg: {
    position: "absolute",
    width: "100%",
    height: "100%",
    top: 0,
    left: 0
  },
  modalInner: {
    position: "absolute",
    height: "100%",
    zIndex: 1,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.black,
    shadowOpacity: 0.3,
    shadowRadius: 3,
    shadowOffset: {
      width: 2,
      height: 2
    },
    elevation: 4
  },
  list: {
    backgroundColor: colors.white,
    borderRadius: 4
  }
});

class Select extends PureComponent {
  state = {
    active: false
  };

  open = () => {
    this.currentComponent.measureInWindow((x, y, width, height) => {
      const { maxHeight, minHeight, options } = this.props;
      const windowHeight = Dimensions.get("window").height;
      let modalY = y;
      const modalMinHeight = minHeight
        ? Math.min(options.length * height, minHeight)
        : null;
      let modalMaxHeight = Math.min(windowHeight - y, maxHeight);
      if (modalMinHeight > modalMaxHeight) {
        modalMaxHeight = Math.min(y + height, maxHeight);
        modalY = y + height - modalMaxHeight;
      }
      this.setState({
        active: true,
        x,
        y: modalY,
        width,
        height,
        minHeight: modalMinHeight,
        maxHeight: modalMaxHeight
      });
    });
  };

  dismiss = () => {
    console.log("dismiss");
    this.setState({ active: false });
  };

  render() {
    const { active, x, y, width, height, minHeight, maxHeight } = this.state;
    const { value, options, placeholder, setFieldValue } = this.props;
    const selectedOption = options[value];
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={this.open}>
          <View>
            <Text
              ref={component => {
                this.currentComponent = component;
              }}
              style={styles.current}
              suppressHighlighting
            >
              {selectedOption ? selectedOption.label : placeholder}
            </Text>
          </View>
        </TouchableOpacity>
        <Modal visible={active} transparent={true}>
          <View style={styles.modal}>
            <TouchableWithoutFeedback onPressIn={this.dismiss}>
              <View style={styles.modalBg} />
            </TouchableWithoutFeedback>
            <View
              style={[
                styles.modalInner,
                {
                  left: x,
                  top: y,
                  width: width,
                  minHeight,
                  maxHeight
                }
              ]}
            >
              <FlatList
                data={options}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
                keyExtractor={item => item.label}
                initialScrollIndex={value}
                getItemLayout={(data, index) => ({
                  length: height,
                  offset: height * index,
                  index
                })}
                style={styles.list}
                renderItem={({ item, index }) => (
                  <TouchableOpacity
                    onPress={() => {
                      this.dismiss();
                      setFieldValue(index);
                    }}
                  >
                    <Text style={styles.option} suppressHighlighting>
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}

Select.defaultProps = {
  selectedIndex: -1,
  maxHeight: 225,
  minHeight: 125,
  placeholder: "都道府県"
};

Select.propTypes = {
  value: PropTypes.number,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired
    })
  ).isRequired,
  placeholder: PropTypes.string,
  maxHeight: PropTypes.number
};

export default Select;
