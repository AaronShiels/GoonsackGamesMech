using System.IO;
using System.Xml.Serialization;
using Microsoft.Xna.Framework.Content.Pipeline;

namespace Cyborg.ContentPipeline.Tiled
{
    [ContentImporter(".tmx", DefaultProcessor = "Tiled Map Processor", DisplayName = "Tiled Map Importer")]
    public class TiledMapImporter : ContentImporter<TiledMapXmlRoot>
    {
        public override TiledMapXmlRoot Import(string filename, ContentImporterContext context)
        {
            using var fileStream = File.Open(filename, FileMode.Open);
            var serializer = new XmlSerializer(typeof(TiledMapXmlRoot));
            return (TiledMapXmlRoot)serializer.Deserialize(fileStream);
        }
    }
}