// Generated by CoffeeScript 1.12.7
var Palette,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Palette = (function(superClass) {
  extend(Palette, superClass);

  Palette.prototype.ARTBOARD_TAG = "artboard";

  Palette.prototype.PALETTE_SPACING = 26;

  Palette.prototype.CELL_SPACING = 30;

  Palette.prototype.COLORS_PER_ROW = 4;

  Palette.prototype.colorClassifier = new ColorClassifier();

  function Palette(context, layer) {
    var children, color, colorsArray, documentColorAssets, i, j, ref;
    if (layer == null) {
      layer = null;
    }
    log("adasd");
    Palette.__super__.constructor.call(this, context, layer);
    children = this.currentPage.children();
    for (i = j = 0, ref = children.count(); 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
      layer = children[i];
      if (this.command.valueForKey_onLayer_forPluginIdentifier(this.ARTBOARD_TAG, layer, this.pluginID)) {
        log("FOUND Palette!");
        this.artboard = layer;
      }
    }
    if (this.context.document) {
      documentColorAssets = this.context.document.documentData().assets().colorAssets().objectEnumerator();
      colorsArray = NSMutableArray.alloc().init();
      while (color = documentColorAssets.nextObject()) {
        colorsArray.addObject(color.color());
      }
      this.colors = colorsArray;
    }
  }

  Palette.prototype.regenerate = function() {
    var array;
    array = this.getColorsDictionaries().map(function(colorDictionary) {
      return ColorFormatter.dictionaryToColor(colorDictionary);
    });
    this.colors = NSArray.alloc().initWithArray(array);
    return this.generate();
  };

  Palette.prototype.generate = function() {
    var bounds, cell, color, column, i, j, name, ref, ref1, row;
    if (this.colors.count() === 0) {
      NSApplication.sharedApplication().displayDialog_withTitle("There are no colors on your Document Colors.", "Feed me colors!");
    }
    if (!this.artboard) {
      log("New palette...");
      this.artboard = this.template.getArtboard();
      this.artboard.setName("Prism Palette");
      this.command.setValue_forKey_onLayer_forPluginIdentifier(true, this.ARTBOARD_TAG, this.artboard, this.pluginID);
    }
    this.artboard.removeAllLayers();
    row = 0;
    column = 0;
    for (i = j = 0, ref = this.colors.count(); 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
      if (column >= this.COLORS_PER_ROW) {
        column = 0;
        row++;
      }
      color = this.colors[i];
      cell = new Cell(this.context);
      name = (ref1 = this.aliasForColor(color)) != null ? ref1 : this.colorClassifier.classify(color.immutableModelObject().hexValue());
      cell.setColor_withName(color, name);
      cell.setX((cell.width + this.CELL_SPACING) * column + this.CELL_SPACING);
      cell.setY((cell.height + this.CELL_SPACING) * row + this.CELL_SPACING);
      this.artboard.addLayers([cell.layer]);
      column++;
    }
    this.artboard.frame().setHeight((cell.height + this.CELL_SPACING) * (row + 1) + this.CELL_SPACING);
    this.artboard.frame().setWidth((cell.width + this.CELL_SPACING) * Math.min(this.colors.count(), this.COLORS_PER_ROW) + this.CELL_SPACING);
    this.artboard.removeFromParent();
    bounds = this.currentPage.contentBounds();
    this.artboard.frame().setX(bounds.origin.x - this.artboard.frame().width() - this.PALETTE_SPACING);
    this.artboard.frame().setY(bounds.origin.y);
    return this.currentPage.addLayers([this.artboard]);
  };

  Palette.prototype.getColorsDictionaries = function() {
    var children, colorDictionary, colors, i, j, ref;
    colors = [];
    children = this.artboard.children();
    for (i = j = 0, ref = children.count(); 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
      colorDictionary = this.valueForKey_onLayer(Cell.prototype.CELL_LAYER_TAG, children[i]);
      if (colorDictionary) {
        colors.push(colorDictionary);
      }
    }
    return colors;
  };

  Palette.prototype.getColorsDictionariesFromLayers = function(layers) {
    var colorDictionary, colors, i, j, ref;
    colors = [];
    for (i = j = 0, ref = layers.count(); 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
      colorDictionary = this.valueForKey_onLayer(Cell.prototype.CELL_LAYER_TAG, layers[i]);
      if (colorDictionary) {
        colors.push(colorDictionary);
      }
    }
    return colors;
  };

  Palette.prototype.aliasForColor = function(color) {
    return this.valueForKey_onLayer(color.immutableModelObject().hexValue(), this.artboard);
  };

  return Palette;

})(Base);
