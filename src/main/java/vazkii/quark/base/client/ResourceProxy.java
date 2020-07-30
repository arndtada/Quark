//package vazkii.quark.base.client;
//
//import java.io.File;
//import java.io.IOException;
//import java.io.InputStream;
//import java.util.ArrayList;
//import java.util.Collection;
//import java.util.HashMap;
//import java.util.List;
//import java.util.Map;
//import java.util.Set;
//import java.util.function.BooleanSupplier;
//import java.util.function.Predicate;
//import java.util.stream.Collectors;
//
//import javax.annotation.Nonnull;
//
//import com.google.common.collect.ImmutableSet;
//
//import net.minecraft.client.Minecraft;
//import net.minecraft.client.resources.ClientResourcePackInfo;
//import net.minecraft.resources.IPackFinder;
//import net.minecraft.resources.ResourcePack;
//import net.minecraft.resources.ResourcePackInfo;
//import net.minecraft.resources.ResourcePackInfo.IFactory;
//import net.minecraft.resources.ResourcePackType;
//import net.minecraft.util.ResourceLocation;
//import vazkii.quark.base.Quark;
//import vazkii.quark.vanity.module.EmotesModule;
//
//public final class ResourceProxy extends ResourcePack {
//
//	private static final String MINECRAFT = "minecraft";
//	private static final String RESOURCE_PROXY_NAME = "quark:resourceproxy";
//	private static final Set<String> RESOURCE_DOMAINS = ImmutableSet.of(MINECRAFT);
//
//	private static final String BARE_FORMAT = "assets/" + MINECRAFT + "/%s/%s/%s";
//	private static final String OVERRIDE_FORMAT = "/assets/" + Quark.MOD_ID + "/overrides/%s/%s/%s";
//
//	private static ResourceProxy instance;
//
//	private final Map<String, ResourceOverride> overrides = new HashMap<>();
//
//	public static void init() {
//		instance = new ResourceProxy();
//
//		Minecraft mc = Minecraft.getInstance();
//		mc.getResourcePackList().addPackFinder(new IPackFinder() {
//
//			@Override
//			public <T extends ResourcePackInfo> void addPackInfosToMap(Map<String, T> nameToPackMap, IFactory<T> packInfoFactory) {
//				T t = ClientResourcePackInfo.createResourcePack(RESOURCE_PROXY_NAME, true, () -> instance, packInfoFactory, ResourcePackInfo.Priority.BOTTOM); 
//				nameToPackMap.put(RESOURCE_PROXY_NAME, t);
//				
//				EmotesModule.addResourcePack(nameToPackMap, packInfoFactory);
//			}
//
//		});
//	}
//
//	private ResourceProxy() {
//		super(new File("quark"));
//		addMetadataResource("pack.mcmeta");
//		addMetadataResource("pack.png");
//	}
//
//	public static ResourceProxy instance() {
//		return instance;
//	}
//	
//	public void ensureNotLast() {
//		Minecraft mc = Minecraft.getInstance();
//		Collection<ClientResourcePackInfo> coll = mc.getResourcePackList().getEnabledPacks();
//		
//		int i = 0;
//		int quarkPos = -1;
//		int vanillaPos = -1;
//		
//		for(ClientResourcePackInfo pack : coll) {
//			if(pack.getName().equals("vanilla"))
//				vanillaPos = i;
//			else if(pack.getName().equals(RESOURCE_PROXY_NAME))
//				quarkPos = i;
//			
//			i++;
//		}
//		
//		if(quarkPos < vanillaPos) {
//			List<ClientResourcePackInfo> newList = new ArrayList<>(coll);
//			ClientResourcePackInfo vanillaPack = newList.get(vanillaPos);
//			ClientResourcePackInfo quarkPack = newList.get(quarkPos);
//			
//			newList.set(vanillaPos, quarkPack);
//			newList.set(quarkPos, vanillaPack);
//			mc.getResourcePackList().setEnabledPacks(newList);
//		}
//	}
//	
//	public void addResource(String type, String path, String value, BooleanSupplier isEnabled) {
//		ResourceOverride res = new ResourceOverride(type, path, value, isEnabled); 
//		overrides.put(res.getPathKey(), res);
//	}
//	
//	private void addMetadataResource(String path) {
//		overrides.put(path, new MetadataResourceOverride(path));
//	}
//
//	@Nonnull
//	@Override
//	public Set<String> getResourceNamespaces(ResourcePackType type) {
//		return type == ResourcePackType.CLIENT_RESOURCES ? RESOURCE_DOMAINS : ImmutableSet.of();
//	}
//
//	@Nonnull
//	@Override
//	protected InputStream getInputStream(String resourcePath) throws IOException {
//		ResourceOverride target = overrides.get(resourcePath);
//		return target == null || !target.isEnabled() ? null : Quark.class.getResourceAsStream(target.getReplacementValue());
//	}
//
//	@Override
//	protected boolean resourceExists(String resourcePath) {
//		ResourceOverride res = overrides.get(resourcePath);
//		return res != null && res.isEnabled();
//	}
//
//	@Override
//	public Collection<ResourceLocation> getAllResourceLocations(ResourcePackType type, String pathIn, int maxDepth, Predicate<String> filter) {
//		return overrides.values().stream()
//				.filter(ResourceOverride::isEnabled)
//				.filter(o -> o.type.equals(pathIn))
//				.filter(o -> !o.file.contains(".mcmeta"))
//				.map(o -> new ResourceLocation(o.getReplacementValue()))
//				.collect(Collectors.toList());
//	}
//
//	@Override
//	public void close() throws IOException {
//		// NO-OP
//	}
//
//	@Override
//	public String getName() {
//		return "Quark Resource Proxy";
//	}
//	
//	@Override
//	public boolean isHidden() {
//		return false;
//	}
//	
//	public boolean hasAny() {
//		for(ResourceOverride over : overrides.values())
//			if(over.isEnabled())
//				return true;
//		
//		return false;
//	}
//	
//	private static class ResourceOverride {
//		
//		protected final String type, path, file;
//		private final BooleanSupplier isEnabled;
//		
//		public ResourceOverride(String type, String path, String file, BooleanSupplier isEnabled) {
//			this.type = type;
//			this.path = path;
//			this.file = file;
//			this.isEnabled = isEnabled;	
//		}
//		
//		String getPathKey() {
//			return String.format(BARE_FORMAT, type, path, file);
//		}
//		
//		String getReplacementValue() {
//			return String.format(OVERRIDE_FORMAT, type, path, file);
//		}
//		
//		boolean isEnabled() {
//			return isEnabled.getAsBoolean();
//		}
//		
//	}
//	
//	private static class MetadataResourceOverride extends ResourceOverride {
//
//		public MetadataResourceOverride(String path) {
//			super("", path, "/proxy" + path, () -> true);
//		}
//		
//		@Override
//		String getPathKey() {
//			return path;
//		}
//		
//		@Override
//		String getReplacementValue() {
//			return file;
//		}
//		
//	}
//
//}
