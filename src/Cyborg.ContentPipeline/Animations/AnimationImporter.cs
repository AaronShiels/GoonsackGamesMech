using System.IO;
using System.Text;
using System.Text.Json;
using Microsoft.Xna.Framework.Content.Pipeline;

namespace Cyborg.ContentPipeline.Animation
{
    [ContentImporter(".anim", DefaultProcessor = "AnimationProcessor", DisplayName = "Animation Importer")]
    public class AnimationImporter : ContentImporter<AnimationSetJson>
    {
        private static readonly JsonSerializerOptions _jsonOptions = new() { PropertyNameCaseInsensitive = true };

        public override AnimationSetJson Import(string filename, ContentImporterContext context)
        {
            var raw = File.ReadAllText(filename, Encoding.UTF8);
            return JsonSerializer.Deserialize<AnimationSetJson>(raw, _jsonOptions);
        }
    }
}