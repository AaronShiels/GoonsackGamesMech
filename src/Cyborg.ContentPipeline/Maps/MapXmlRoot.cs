using System.Collections.Generic;
using System.Xml.Serialization;

namespace Cyborg.ContentPipeline.Maps
{
    [XmlRoot("map")]
    public class MapXmlRoot
    {
        [XmlAttribute("renderorder")]
        public string RenderOrder { get; set; }

        [XmlAttribute("width")]
        public short Width { get; set; }

        [XmlAttribute("height")]
        public short Height { get; set; }

        [XmlAttribute("tilewidth")]
        public short TileWidth { get; set; }

        [XmlAttribute("tileheight")]
        public short TileHeight { get; set; }

        [XmlElement("tileset")]
        public TileSetXmlElement TileSet { get; set; }

        [XmlElement("layer")]
        public List<LayerXmlElement> Layers { get; set; }

        [XmlElement("objectgroup")]
        public List<ObjectGroupXmlElement> ObjectGroups { get; set; }

        public class TileSetXmlElement
        {
            [XmlAttribute("tilewidth")]
            public short TileWidth { get; set; }

            [XmlAttribute("tileheight")]
            public short TileHeight { get; set; }

            [XmlAttribute("tilecount")]
            public short TileCount { get; set; }

            [XmlAttribute("columns")]
            public short Columns { get; set; }

            [XmlElement(ElementName = "image")]
            public ImageXmlElement Image { get; set; }

            public class ImageXmlElement
            {
                [XmlAttribute("source")]
                public string Source { get; set; }
            }
        }

        public class ObjectGroupXmlElement
        {
            [XmlAttribute(AttributeName = "name")]
            public string Name { get; set; }

            [XmlElement("object")]
            public List<ObjectXmlElement> Objects { get; set; }

            public class ObjectXmlElement
            {
                [XmlAttribute(AttributeName = "x")]
                public int X { get; set; }
                [XmlAttribute(AttributeName = "y")]
                public int Y { get; set; }
                [XmlAttribute(AttributeName = "width")]
                public int Width { get; set; }
                [XmlAttribute(AttributeName = "height")]
                public int Height { get; set; }
            }
        }

        public class LayerXmlElement
        {
            [XmlAttribute(AttributeName = "name")]
            public string Name { get; set; }

            [XmlAttribute(AttributeName = "width")]
            public short Width { get; set; }

            [XmlAttribute(AttributeName = "height")]
            public short Height { get; set; }

            [XmlElement(ElementName = "data")]
            public DataXmlElement Data { get; set; }

            public class DataXmlElement
            {
                [XmlText]
                public string Value { get; set; }
            }
        }
    }
}