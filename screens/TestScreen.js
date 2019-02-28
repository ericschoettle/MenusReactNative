import React, { Component } from 'react';
import {
  Animated,
  Dimensions,
  TouchableHighlight,
  StyleSheet,
  Image,
  Text,
  View
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';


const menus = {
  'Main': {
    'items': {
      'My Schedule & Bidding': { imageSource: null, isMenu: true },
      'Safety': { imageSource: null, isMenu: true },
      'Training': { imageSource: null, isMenu: false },
      'Administration': { imageSource: null, isMenu: true },
      'Catering & Brand': { imageSource: null, isMenu: true },
      'Hotels': { imageSource: null, isMenu: false },
      'My Base': { imageSource: null, isMenu: false },
      'Recognition': { imageSource: null, isMenu: false },
      'My Leadership Team': { imageSource: null, isMenu: false }
    }
  },
  'Safety': {
    'items': {
      'Reporting': { imageSource: null, isMenu: true },
      'Agriculture & Customs': { imageSource: null, isMenu: true },
      'Known Crewmember': { imageSource: null, isMenu: false },
      'Product Safety Data Search': { imageSource: null, isMenu: false },
    }
  },
  'Reporting': {
    'items': {
      'I-21 Injury Reporting': { imageSource: null, isMenu: false },
      'ASAP Reporting': { imageSource: null, isMenu: false },
      'General ASAP Information': { imageSource: null, isMenu: false },
      'Flight Attendant Incident Report': { imageSource: null, isMenu: false },
    }
  },
  'Administration': {
    'items': {
      'OJI and Leaves': { imageSource: null, isMenu: false },
      'Pay and Benefits': { imageSource: null, isMenu: false },
      'Performance': { imageSource: null, isMenu: false },
      'Inflight Resource Directory': { imageSource: null, isMenu: false },
      'Mobile and web': { imageSource: null, isMenu: false },
      'AFA': { imageSource: null, isMenu: false }
    }
  }
}

const colorPriority = ['rgb(240, 240, 240)', 'rgb(135, 206, 235)', 'rgb(70, 130, 180)', 'rgb(67, 70, 75)'];

class Menu extends Component {
  constructor(props) {
    super(props);

    this._anim = new Animated.Value(0);
  }

  // Animate new components
  componentDidMount() {
    Animated.timing(this._anim, {
      toValue: 1,
      duration: 300,
    }).start();
  }

  // Animate removal of components
  onRemove = (index) => {
    if (this.props.onRemove) {
      Animated.timing(this._anim, {
        toValue: 0,
        duration: 300,
      }).start(() => this.props.onRemove(index));
    }
  }

  render() {
    // Rename for convenience
    const menuPath = this.props.menuPath;
    const menuName = this.props.menuName;

    // Calculae depth of nesing 
    const depth = menuPath.indexOf(menuName);
    const inverseDepth = menuPath.length - (depth + 1);

    // Find submenus and items for this menu
    const subMenuName = (depth + 1) < menuPath.length ? menuPath[depth + 1] : null;
    const items = menus[this.props.menuName] ? menus[this.props.menuName].items : {};

    // Grab winmdow size
    const { height, width } = Dimensions.get('window');
    const columnWidth = Math.round(width / 8);

    // Crreate variable that are filled in later but need scoping here
    let jsxMenuHeader = null;
    let jsxSubMenu = null;
    let beginSlide = null;
    const endSlide = columnWidth * depth;


    // Only animate if last submenu 
    if (depth && inverseDepth === 0) { 
      beginSlide = (width - depth * columnWidth);
    } else {
      beginSlide = endSlide;
    }

    // Create Items for display
    const jsxItems = Object.entries(items).map((item, i) => {
      const itemName = item[0];
      const itemData = item[1];
      const jsxItem = <MenuItem
        key={i}
        itemName={itemName}
        isMenu={itemData.isMenu}
        isSelected={subMenuName === itemName}
        imageSource={itemData.imageSource}
        onAdd={this.props.onAdd}
        depth={depth}
        inverseDepth={inverseDepth}
      />
      return jsxItem;
    });

    // Interpolate colors - NOTE: this works but isn't showing up - for some reason can only run one animation at a time
    const bgColor = this._anim.interpolate({
      inputRange: [0, 1],
      outputRange: [
        inverseDepth ? colorPriority[inverseDepth - 1] : colorPriority[0],
        colorPriority[inverseDepth]
      ]
    });

    // Interpolate slide animation
    const left = this._anim.interpolate({
      inputRange: [0, 1],
      outputRange: [beginSlide, endSlide]
    });

    //Create styles
    const styles = {
      menu: {
          position: 'absolute',
          height: height,
          left: left,
          width: width - depth * columnWidth,
          backgroundColor: bgColor
      },
    };

    // Recursive - if there is a submenu, nest a Menu compoent inside
    if (subMenuName) {
      jsxSubMenu = (
        <View>
          <Menu menuName={subMenuName} menuPath={menuPath} onAdd={this.props.onAdd} onRemove={this.props.onRemove}
          />
        </View>)
    }

    // If last submenu, make header and animate
    if (depth && inverseDepth === 0) { // If last submenu
      jsxMenuHeader = (
        <MenuHeader menuName={menuName} depth={depth} inverseDepth={inverseDepth} onRemove={this.props.onRemove}/>
      )
    } 


    return (
      <View >
        <Animated.View style={styles.menu}>
          {jsxMenuHeader}
          {jsxItems}
        </Animated.View >
        <View>
          {jsxSubMenu}
        </View>
      </View>
    );
  }
}

class MenuHeader extends Component {
  render() {
    const styles = {
      menuHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderRadius: 0.5,
        borderWidth: 0.5,
        borderColor: 'steelblue',
        height: 50,
      },
      leftText: {
        fontSize: 20, 
        marginLeft: 20, 
        fontWeight: 'bold' 
      },
      rightText: { 
        fontSize: 20, 
        marginRight: 20, 
        fontWeight: 'bold' 
      }
    }

    return (
      <View style={{ ...styles.menuHeader, backgroundColor: colorPriority[this.props.inverseDepth] }}>
      <Text style={styles.leftText}>
        {this.props.menuName}
      </Text>
      <Text onPress={() => (this.props.onRemove(this.props.depth))} style={styles.rightText}>
        X
      </Text>
    </View>
    )
  }
}

class MenuItem extends Component {
  render() {
    let navigation = null;
    if (this.props.isMenu) {
      navigation = (
        <Text
          onPress={() => {
            this.props.onAdd({
              action: 'addToPath',
              itemName: this.props.itemName,
              depth: this.props.depth
            })
          }}
          style={{ alignItems: 'flex-end' }}
        >
          <FontAwesome name="bars" size={20} />
        </Text>
      )
    }

    const styles = StyleSheet.create({
      menuItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderRadius: 0.5,
        borderWidth: 0.5,
        borderColor: 'steelblue',
        height: 50,
      },
      leftContainer: {
        flex: 5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
      },
      rightContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center'
      },
      selectedMenuItem: {
        flexDirection: 'row',
        borderRadius: 0.5,
        borderWidth: 0.5,
        borderColor: 'steelblue',
        height: 50,
      },
      menuItemText: {
        marginLeft: 5,
        fontSize: 15,
      },
      image: {
        height: 30,
        margin: 10,
        aspectRatio: 1
      }
    });

    return (
      <View style={this.props.isSelected ? { ...styles.selectedMenuItem, backgroundColor: colorPriority[this.props.inverseDepth - 1] } : styles.menuItem} >
        <View style={styles.leftContainer}>
          <TouchableHighlight onPress={() => {
            this.props.onAdd({ itemName: this.props.itemName, depth: this.props.depth })
          }}>
            <Image source={{ uri: 'https://facebook.github.io/react/logo-og.png' }} style={styles.image} />
          </TouchableHighlight>
          <Text style={styles.menuItemText} > {this.props.itemName}</Text>
        </View>
        <View style={styles.rightContainer}>
          {navigation}
        </View>
      </View>
    );
  }
}

export default class TestScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      menuPath: [
        'Main',
        'Safety'
      ],
    }
  }

  static navigationOptions = {
    title: 'Alaska Airlines',
  }

  handleRemove(index) {
    let menuPath = [...this.state.menuPath];
    console.log(index)
    menuPath = menuPath.slice(0, index)
    this.setState({ menuPath: menuPath });
  }

  handleAdd(data) {
    let menuPath = [...this.state.menuPath];
    // Trim excess if not the last item
    menuPath = menuPath.slice(0, data.depth + 1)
    // Add new item
    menuPath.push(data.itemName);

    this.setState({ menuPath: menuPath });
  }

  render() {
    return (
      <View>
        <Menu
          menuName='Main'
          menuPath={this.state.menuPath}
          onAdd={(data) => { this.handleAdd(data) }}
          onRemove={(index) => { this.handleRemove(index) }}
        />
      </View>
    );
  }
}
