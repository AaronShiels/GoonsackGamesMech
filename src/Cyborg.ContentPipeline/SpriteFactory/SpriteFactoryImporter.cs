using System.IO;
using System.Text;
using System.Text.Json;
using Microsoft.Xna.Framework.Content.Pipeline;

namespace Cyborg.ContentPipeline.SpriteFactory
{
    [ContentImporter(".sf", DefaultProcessor = "Sprite Factory Processor", DisplayName = "Sprite Factory Importer")]
    public class SpriteFactoryImporter : ContentImporter<SpriteFactoryJson>
    {
        private static readonly JsonSerializerOptions _jsonOptions = new() { PropertyNameCaseInsensitive = true };

        public override SpriteFactoryJson Import(string filename, ContentImporterContext context)
        {
            var raw = File.ReadAllText(filename, Encoding.UTF8);
            return JsonSerializer.Deserialize<SpriteFactoryJson>(raw, _jsonOptions);
        }
    }
}