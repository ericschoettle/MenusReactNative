import React, { Component } from 'react';
import { AppRegistry, TouchableHighlight, StyleSheet, Image, Text, View } from 'react-native';
// To do: make the heading show up above the image
// Make the color and nesting smart - be able to read. Also get rid of boundaries. 
// Fix out button
// Animate!

const menus = {
  'Main': {
    'items': {
      'My Schedule & Bidding': {imageSource: null, isMenu: true},
      'Safety': {imageSource: null, isMenu: true},
      'Training': {imageSource: null, isMenu: false},
      'Administration': {imageSource: null, isMenu: true},
      'Catering & Brand': {imageSource: null, isMenu: true},
      'Hotels': {imageSource: null, isMenu: false},
      'My Base': {imageSource: null, isMenu: false},
      'Recognition': {imageSource: null, isMenu: false},
      'My Leadership Team': {imageSource: null, isMenu: false}
    }
  },
  'Safety': {
    'items': {
      'Reporting': {imageSource: null, isMenu: true},
      'Agriculture & Customs': {imageSource: null, isMenu: true},
      'Known Crewmember': {imageSource: null, isMenu: false},
      'Product Safety Data Search': {imageSource: null, isMenu: false},
    }
  },
  'Reporting': {
    'items': {
      'I-21 Injury Reporting': {imageSource: null, isMenu: false},
      'ASAP Reporting': {imageSource: null, isMenu: false},
      'General ASAP Information': {imageSource: null, isMenu: false},
      'Flight Attendant Incident Report': {imageSource: null, isMenu: false},
    }
  },
  'Administration': {
    'items': {
      'OJI and Leaves': {imageSource: null, isMenu: false},
      'Pay and Benefits': {imageSource: null, isMenu: false},
      'Performance': {imageSource: null, isMenu: false},
      'Inflight Resource Directory': {imageSource: null, isMenu: false},
      'Mobile and web': {imageSource: null, isMenu: false},
      'AFA': {imageSource: null, isMenu: false}
    }
  }
}

const styles = StyleSheet.create({

  menu: {
    flex: 1,
    alignItems: 'stretch',
    backgroundColor: 'skyblue',
  },
  compactMenu: {
    width: 50,
    alignItems: 'stretch',
    backgroundColor: 'skyblue',
  },
  menuHeader: {
    marginLeft: 5,
    fontSize: 20,
    fontWeight: 'bold'
  },
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
    backgroundColor: 'white',
    height: 50,
  },
  menuItemText: {
    marginLeft: 5,
    fontSize: 15,
  },
  activeMenuItem: {
    backgroundColor: 'white',
  },
  image: {
    height: 30,
    margin: 10,
    aspectRatio: 1
  }
});

class Menu extends Component {
  render() {
    const menuPath = this.props.menuPath;
    const menuName = this.props.menuName;
    const depth = menuPath.indexOf(menuName);
    const selectedSubMenuName = (depth + 1) < menuPath.length ? menuPath[depth + 1] : null;

    const items = menus[this.props.menuName] ? menus[this.props.menuName].items : {};

    let jsxMenuHeader = null;
    let jsxSubMenu = null;

    if (depth && depth + 1 === menuPath.length) {
      jsxMenuHeader = <Text 
        onPress={()=>this.props.onPress({type: 'menuHeader', menuName: menuName, depth: depth})}
        style={styles.menuHeader}
      >
        {menuName}
      </Text>
    }

    if (selectedSubMenuName) {
      jsxSubMenu = (
        <View style={{flex: 1, backgroundColor: 'white'}}>
          <Menu menuName={selectedSubMenuName} menuPath={menuPath} onPress={this.props.onPress}/>
        </View>)
    }

    const jsxItems = Object.entries(items).map( (item, i) => {
      const itemName = item[0];
      const itemData = item[1];
      let jsxItem;
      if (selectedSubMenuName) {
        jsxItem = <Thumbnail
          key={i}
          itemName={itemName}
          isSelected={selectedSubMenuName === itemName} 
          imageSource={itemData.imageSource}
          onPress={this.props.onPress}
          depth={depth}
        />
      } else {
        jsxItem = <MenuItem 
          key={i}
          itemName={itemName} 
          isMenu={itemData.isMenu} 
          imageSource={itemData.imageSource}
          onPress={this.props.onPress}
          depth={depth}
        />
      }
      return jsxItem;
    });

    return (
      <View style={{flexDirection: 'row'}}>
        <View style={selectedSubMenuName ? styles.compactMenu : styles.menu}>
          {jsxMenuHeader}
          {jsxItems}
          <View style={{height: 50, backgroundColor: 'gray'}}/>
          <View style={{flexGrow: 1, backgroundColor: 'blue'}}/>

        </View>
        {jsxSubMenu}
      </View>
    );
  }
}

class Thumbnail extends Component {
  render() {
    return (
      <View style={this.props.isSelected ? styles.selectedMenuItem : styles.menuItem} >
        <TouchableHighlight  onPress={()=>{this.props.onPress({
            action: 'remove', 
            itemName: this.props.itemName, 
            depth: this.props.depth})
          }}>
          <Image 
            source={{uri: 'https://facebook.github.io/react/logo-og.png'}} 
            style={styles.image} 
          />
        </TouchableHighlight>
      </View>
    );
  }
}

class MenuItem extends Component {
  render() {
    let navigation = null;
    if (this.props.isMenu) {
      navigation = (
        <Text 
        onPress={()=>{this.props.onPress({
          action: 'addToPath', 
          itemName: this.props.itemName, 
          depth: this.props.depth})
        }}
        style={{alignItems: 'flex-end'}}>IN</Text> 
      )
    }

    // <Text 
    // style={{textAlign: 'right'}}>OUT</Text>

    return (
      <View style={styles.menuItem} >
        <View style={styles.leftContainer}>
          <Image source={{uri: 'https://facebook.github.io/react/logo-og.png'}} style={styles.image} />
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
      ]
    }
  }

  static navigationOptions = {
    title: 'Test',
  }

  handlePress (data) {
    let menuPath = [...this.state.menuPath];
    switch (data.action) {
      case 'addToPath':
        // Trim excess if not the last item
        menuPath = menuPath.slice(0, data.depth + 1)
        // Add new item
        menuPath.push(data.itemName);

        this.setState({menuPath: menuPath});
        break;
      case 'remove':
        menuPath = menuPath.slice(0, data.depth + 1)

        this.setState({menuPath: menuPath});
        break;
      default:
        break;
    }
  }

  render() {
    return (
      <View>
        <Menu menuName='Main' menuPath={this.state.menuPath} onPress={(data)=>{this.handlePress(data)}} />
      </View>
    );
  }
}
