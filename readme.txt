=== Plugin Name ===
Contributors: Jouni Santara, TERE-tech ltd
Donate link: http://www.tere-tech.eu/
Tags: nvd3, d3, visualisation, chart, graph, CSS, CSS3, SVG, vector graphics, DOM, HTML5
Requires at least: 3.3.2
Tested up to: 3.9
Stable tag: 1.5.8
License: GPLv2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html

NVD3 visualisations give you tools on WordPress to generate impressive business quality charts based on the famous open NVD3 framework of JavaScript.

== Description ==

NVD3 visualisations is a full set of visually interactive charts that can be controlled by simple options.

You can start to create any example chart into your blog and study it more before you decide if that suits for your visual presentation's needs at hand.

This product lets you generate as many copies of different charts on the one page as you wish and scale their size just the way you like case by case.

All the example's input data sets are stored in the same format on data folder so that you can easily copy them and start to use them as a template for your own data's needs.

This package is produced as an example how to bring in high level chart galleries into WordPress CMS and there is no active support available. 

If you like it give us some stars on WP plugin site so that others can find it more easily too 
- thank you !
.

**Key Features**

1. Full set of original NVD3's gallery charts (12 types of charts in gallery).
1. Super easy to illustrate your data sets by picking up template chart from any gallery's examples.
1. WYSIWYG look of chart on front-end + data editor to populate own data.
1. Support of JSON/XML or CSV/TSV data formats.
1. Smart suggestion of online syntax editor from cloud based on data's type.
1. Easy to scale charts in pixels.
1. Accurate layout of each chart based on any valid HTML container tag.
1. Many charts on the same page/post of WordPress from one API / shortcode call.
1. Many fancy options available to change chart's look & behavior.
1. Dynamic & direct illustration of any JavaScript function results.
1. Visual preview of charts from the NVD3 lib's original CSS style file to let you match blog's theme easily.
.

**Data input**

* Data's import from valid JSON/XML/CSV/TSV file or from own data generating JavaScript function.
.

**HAPPY CHARTING on WordPress !**

**Credits**

This open source distribution contains visualisation libraries from:

* [Robin Hu, NVD3] (http://github.com/novus/nvd3  "Higher level library to create fast & easy D3 charts.")
* [Michael Bostock, D3] (http://github.com/mbostock/d3  "Famous open source visualisation library core.")

Big thanks for these talents by making NVD3 visualisations for WordPress technically possible too.

== Installation ==

Two WP standard ways to install the package.

1. Go to wordpress 'Dashboard' front page.
1. Select PlugIns / Add New for searching new plugin from internet.
1. Write 'NVD3' to the search box + Search PlugIns.
1. Select 'Install Now' under the result of 'NVD3 tools'.
1. Activate the PlugIn on WordPress after its download.
1. Create a new page for charts selection gallery by calling [demosGallery] shortcode.
1. View + bookmark this page and start to clone your charts & edit them.
1. More tips: go to nvd3 plugin's edit (Plugins->Installed plugins->NVD3 Visualisations->edit) and start to read from read_me_1st.txt.

Or you may want to do it 'old traditional way'.

1. Download `nvd3` folder into your local computer.
1. Upload this folder next to the `/wp-content/plugins/` directory into your WordPress server side.
1. Activate the plugin through the 'Plugins' menu in WordPress.
1. Create a new page for charts selection gallery by calling [demosGallery] shortcode.
1. View + bookmark this page and start to clone your charts & edit them.
1. More tips: go to nvd3 plugin's edit (Plugins->Installed plugins->NVD3 Visualisations->edit) and start to read from read_me_1st.txt.

== Frequently Asked Questions ==

= How can I visualize my own data set? =

1. You just check at first the gallery's data folder's input file structure and then you can use any tool to create similar data sets on the blog's root folder. If you open console when demo loads in you can also see what chart type connects to which input file.
1. Next, you may also want to write own custom function from which you directly call on the fly JavaScript API when data set is ready to show out.

= I hate to learn JavaScript API etc, is there any just a simple way to draw charts? =

Shortcode [jsChart] is your easy solution then: first create charts gallery by [demosGallery] shortcode & then start cloning your own charts to the new page/post.

Also, peek into **examples** folder of plugin and start to test shortcodes demos there with your blog.

= How can I find all available chart types & their calling names? =

Look at inside **gallery.js** file on examples dir, please. 

= How do I know which options work together with the chart type that I use? =

Look at inside **chart_options.html** file and its comparisions table, please.

= Where are my data sets stored and what happens for them if I remove chart's page/post or whole plugin? =

Look at the blog's root and the folder called **charts_nvd3**. Data sets are stored there by random names and they stay there until you remove them by FTP client. If you create very many/big data sets it is a pretty good idea to clean this folder from time to time manually.

= How can I change the margins around the chart bigger? =

You have 2 choices here: outside of chart container (normally div/span element) or inside its svg element. Take a look at example **shortcode_margins_demo.txt** to learn more about these options, please.

= How can I change the look of elements of chart from default (eq its lines, bars, etc)? =

You can set custom colors for each chart separately.

If you wish to set own custom palette, use **colors** option. 
Example - options="{colors:'red,green,blue'}"

If you wish to have fixed set of palettes, use **colorbrewer** option. 
Example - options="{colorbrewer:{palette:'Blues'}}"

Finally, there is an option **style** that feeds in all legal values to the chart's svg raw structure. 
A normal example - options="{ style:{'fill':'orange', 'stroke':'navy'} }"

= Is it possible to have multiple charts on the same WP post or page? =

Good point & question !

YES indeed, the software is design so that it transparently creates and draws many charts on the same page and gives you exact control where you like to show them.

= Where is open source if I want to improve it? =

Here:
* http://github.com/wp-plugins/nvd3-visualisations

== Screenshots ==

1. Charts gallery showing out neatly on the same page of WP's blog. 
2. 4 FAST STEPS of New Chart: 1)Clone from Gallery, 2)Feed in Own Data, 3)Edit Post/Page of WP Normally, and 4)Publish It.

== Changelog ==

= 1.5.8 =
Version 1.5.8 -
Expanding coloring for segments of charts: by **colorbrewer** option + palettes or own given set by **colors** option. Support of standard format of D3 on values axis of charts: **format** option. Removing x-axis time dependence from a few chart types. Better default margins for all demo charts.

= 1.5.7 =
Version 1.5.7 -
Support of standard margin options for the chart itself and its external container from input options. The 1st primitive way to change chart's drawing svg styles: color of stroke, fill, opacity, etc. New example of margins use.

= 1.5.6 =
Version 1.5.6 -
Chart's cloning into own popup window + its printing option from there. Resizeable popup charts. Standard border and backgroundcolor support.

= 1.5.5 =
Version 1.5.5 -
Three more chart types accept TSV/CSV input formats (eq cumulativeline, stackedarea, and lineplusbar) and clone from gallery's TSV examples. Support of standard style's float option for right/left placements of chart. 

= 1.5.4 =
Version 1.5.4 -
Three new chart types accept TSV/CSV input formats (eq pie,donut, and discretebar) and clone from gallery. Better filtering of xml input on data editor.

= 1.5.3 =
Version 1.5.3 -
Data converter between json and xml on data editor. More human readable data sets, prettified. Fixed ugly bug of url redirection in creating new chart from gallery.

= 1.5.2 =
Version 1.5.2 -
Chart's dimensions & options visible for easy edit on its created shortcodes. Just publish it: 1-2-3-4 steps on screenshot how to publish from charts gallery.

= 1.5.1 =
Version 1.5.1 -
Better security for data editor's updates of chart data. Expanding gallery to create XML, CSV & TSV based template charts for new posts easily. Automatic showing right data's syntax editor (json/xml). CSV&TSV data sets for multibar. Cooler look of data editor with its new styles.

= 1.5.0 =
Version 1.5.0 -
NEW: Direct data editor for all created own charts automically from gallery that removes itself when you publish. New example from CSV & TSV charts generation calls.

= 1.4.0 =
Version 1.4.0 -
NEW: Expanding input data formats for common CSV and TSV files by supporting them with 3 different chart types (multibar, viewfinder, and simpleline).

= 1.3.1 =
Version 1.3.1 -
Automatic cloning of data sets into blog's root folder when creating new charts from gallery.

= 1.3.0 =
Version 1.3.0 - 
NEW: Charts gallery becomes an automatic chart generating tool for a new post/page. Most gallery demos in XML + perfect functions to convert data between JSON and XML formats.

= 1.2.4 =
Version 1.2.4 - 
Demo charts into 2x6 grid for better room to dislay all with some narrow themes.

= 1.2.3 =
Version 1.2.3 - 
More pretty & helpfull demo charts with titles. New examples how to use XML input files. Tested with the newest WordPress 3.9.

= 1.2.2 =
Version 1.2.2 - 
Better support of XML data format & xml demo mode of whole gallery for testing it.

= 1.2.1 =
Version 1.2.1 - 
NEW: Support of XML data format from input files & demo examples.

= 1.1.1 =
Version 1.1.1 - 
Updating newest d3.js (v3.4.6) in use.

= 1.1.0 =
Version 1.1.0 - 
NEW: direct shortcode API, simple to use + automatic generation of containers.

= 1.0.3 =
Version 1.0.3 - 
Cleaning & reordering of code.

= 1.0.2 =
Version 1.0.2 - 
Minor startup bugs + better readme texts.

= 1.0.0 =
Version 1.0.0 - 
The 1st release of visualisation gallery.

 == Upgrade Notice ==
 
 Goal is to test parallel with 3.3.2 and newest 3.8.1 blogs.
 