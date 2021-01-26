using System.IO;
using System.Runtime.Serialization.Formatters.Binary;

namespace Cyborg.ContentPipeline
{
    public static class BinarySerializer
    {
        private static readonly BinaryFormatter _formatter = new();

        public static void Serialize<T>(Stream output, T value) => _formatter.Serialize(output, value);
        public static T Deserialize<T>(Stream input) => (T)_formatter.Deserialize(input);
    }
}