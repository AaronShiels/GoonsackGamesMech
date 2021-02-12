using Microsoft.Xna.Framework.Content;
using Microsoft.Xna.Framework.Content.Pipeline;
using Microsoft.Xna.Framework.Content.Pipeline.Serialization.Compiler;

namespace Cyborg.ContentPipeline
{
    public class SpriteSpriteSheetReader : ContentTypeReader<AnimationSet>
    {
        protected override AnimationSet Read(ContentReader input, AnimationSet existingInstance) => existingInstance ?? BinarySerializer.Deserialize<AnimationSet>(input.BaseStream);
    }

    [ContentTypeWriter]
    public class SpriteSheetWriter : ContentTypeWriter<AnimationSet>
    {
        protected override void Write(ContentWriter output, AnimationSet value) => BinarySerializer.Serialize(output.BaseStream, value);

        public override string GetRuntimeType(TargetPlatform targetPlatform) => typeof(AnimationSet).AssemblyQualifiedName;
        public override string GetRuntimeReader(TargetPlatform targetPlatform) => typeof(SpriteSpriteSheetReader).AssemblyQualifiedName;
    }
}