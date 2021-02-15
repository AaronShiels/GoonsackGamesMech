using System.Collections.Generic;
using System.IO;
using System.Text;
using System.Text.Json;
using Microsoft.Xna.Framework.Content.Pipeline;

namespace Cyborg.ContentPipeline.Animations
{
    [ContentImporter(".anim", DefaultProcessor = "AnimationProcessor", DisplayName = "Animation Importer")]
    public class AnimationImporter : ContentImporter<IDictionary<string, AnimationJson>>
    {
        private static readonly JsonSerializerOptions _jsonOptions = new() { PropertyNameCaseInsensitive = true };

        public override IDictionary<string, AnimationJson> Import(string filename, ContentImporterContext context)
        {
            var raw = File.ReadAllText(filename, Encoding.UTF8);
            var deserialised = JsonSerializer.Deserialize<Dictionary<string, AnimationJson>>(raw, _jsonOptions);

            return deserialised;
        }
    }
}