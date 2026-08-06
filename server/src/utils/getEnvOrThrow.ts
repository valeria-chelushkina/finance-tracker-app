export function getEnvOrThrow(name: string): string {
  const envVariable = process.env[name];

  if (!envVariable || envVariable.trim() === "") {
    throw new Error(`Error: ${name} is not found or empty in .env file.`);
  }

  return envVariable;
}
