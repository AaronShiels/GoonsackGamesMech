using System.IO;
using System.Xml.Serialization;
using Microsoft.Xna.Framework.Content.Pipeline;

namespace Cyborg.ContentPipeline.Tiled
{
    [ContentImporter(".tmx", DefaultProcessor = "TMX Processor", DisplayName = "TMX Importer")]
    public class MapImporter : ContentImporter<MapXmlRoot>
    {
        public override MapXmlRoot Import(string filename, ContentImporterContext context)
        {
            using var fileStream = File.Open(filename, FileMode.Open);
            var serializer = new XmlSerializer(typeof(MapXmlRoot));
            return (MapXmlRoot)serializer.Deserialize(fileStream);
        }
    }
}