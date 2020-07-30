function injectForEachMethod(method, targetType, clazz, targetName, sig, callback) {
    var ASM = Java.type('net.minecraftforge.coremod.api.ASMAPI');

    var target = ASM.findFirstMethodCall(method,
        targetType,
        clazz,
        targetName,
        sig);

    while (target !== null) {
        var index = method.instructions.indexOf(target);
        var indexShift = callback(target, index);

        var newIndex = method.instructions.indexOf(target);
        if (newIndex !== -1)
            index = newIndex;
        else if (typeof indexShift === 'number')
            index += indexShift;

        target = ASM.findFirstMethodCallAfter(method,
            targetType,
            clazz,
            targetName,
            sig,
            index + 1);
    }

    return method;
}

function initializeCoreMod() {
    return {
        'get-glint-color': {
            'target': {
                'type': 'METHOD',
                'class': 'net.minecraft.client.renderer.ItemRenderer',
                'methodName': 'func_229113_a_', // getBuffer
                'methodDesc': '(Lnet/minecraft/client/renderer/IRenderTypeBuffer;Lnet/minecraft/client/renderer/RenderType;ZZ)Lcom/mojang/blaze3d/vertex/IVertexBuilder;'
            },
            'transformer': function(method) {
                var ASM = Java.type('net.minecraftforge.coremod.api.ASMAPI');
                var Opcodes = Java.type('org.objectweb.asm.Opcodes');
                var VarInsnNode = Java.type('org.objectweb.asm.tree.VarInsnNode');
                var InsnList = Java.type('org.objectweb.asm.tree.InsnList');

                // remap the getGlint() method
                injectForEachMethod(method,
                    ASM.MethodType.STATIC,
                    "net/minecraft/client/renderer/RenderType",
                    ASM.mapMethod("func_228653_j_"), // getGlint
                    "()Lnet/minecraft/client/renderer/RenderType;",
                    function (target, index) {
                        var newInstructions = new InsnList();

                        newInstructions.add(ASM.buildMethodCall(
                            "vazkii/quark/base/handler/AsmHooks",
                            "getGlint",
                            "()Lnet/minecraft/client/renderer/RenderType;",
                            ASM.MethodType.STATIC
                        ));

                        method.instructions.insert(target, newInstructions);
                        method.instructions.remove(target);
                        return method;
                    });

                // remap the getEntityGlint() method
                injectForEachMethod(method,
                    ASM.MethodType.STATIC,
                    "net/minecraft/client/renderer/RenderType",
                    ASM.mapMethod("func_228655_k_"), // getEntityGlint
                    "()Lnet/minecraft/client/renderer/RenderType;",
                    function (target, index) {
                        var newInstructions = new InsnList();

                        newInstructions.add(ASM.buildMethodCall(
                            "vazkii/quark/base/handler/AsmHooks",
                            "getEntityGlint",
                            "()Lnet/minecraft/client/renderer/RenderType;",
                            ASM.MethodType.STATIC
                        ));

                        method.instructions.insert(target, newInstructions);
                        method.instructions.remove(target);
                        return method;
                    });

                return method;
            }
        },

        'get-glint-direct-color': {
            'target': {
                'type': 'METHOD',
                'class': 'net.minecraft.client.renderer.ItemRenderer',
                'methodName': 'func_239391_c_', // getBuffer (?) unmapped at time of writing
                'methodDesc': '(Lnet/minecraft/client/renderer/IRenderTypeBuffer;Lnet/minecraft/client/renderer/RenderType;ZZ)Lcom/mojang/blaze3d/vertex/IVertexBuilder;'
            },
            'transformer': function(method) {
                var ASM = Java.type('net.minecraftforge.coremod.api.ASMAPI');
                var Opcodes = Java.type('org.objectweb.asm.Opcodes');
                var VarInsnNode = Java.type('org.objectweb.asm.tree.VarInsnNode');
                var InsnList = Java.type('org.objectweb.asm.tree.InsnList');

                // remap the getGlintDirect() method
                injectForEachMethod(method,
                    ASM.MethodType.STATIC,
                    "net/minecraft/client/renderer/RenderType",
                    ASM.mapMethod("func_239273_n_"), // getGlintDirect
                    "()Lnet/minecraft/client/renderer/RenderType;",
                    function (target, index) {
                        var newInstructions = new InsnList();

                        newInstructions.add(ASM.buildMethodCall(
                            "vazkii/quark/base/handler/AsmHooks",
                            "getGlintDirect",
                            "()Lnet/minecraft/client/renderer/RenderType;",
                            ASM.MethodType.STATIC
                        ));

                        method.instructions.insert(target, newInstructions);
                        method.instructions.remove(target);
                        return method;
                    });

                // remap the getEntityGlintDirect() method
                injectForEachMethod(method,
                    ASM.MethodType.STATIC,
                    "net/minecraft/client/renderer/RenderType",
                    ASM.mapMethod("func_239274_p_"), // getEntityGlintDirect
                    "()Lnet/minecraft/client/renderer/RenderType;",
                    function (target, index) {
                        var newInstructions = new InsnList();

                        newInstructions.add(ASM.buildMethodCall(
                            "vazkii/quark/base/handler/AsmHooks",
                            "getEntityGlintDirect",
                            "()Lnet/minecraft/client/renderer/RenderType;",
                            ASM.MethodType.STATIC
                        ));

                        method.instructions.insert(target, newInstructions);
                        method.instructions.remove(target);
                        return method;
                    });

                return method;
            }
        },

        'add-glint-types': {
            'target': {
                'type': 'METHOD',
                'class': 'net.minecraft.client.renderer.RenderTypeBuffers',
                'methodName': 'func_228486_a_', // put
                'methodDesc': '(Lit/unimi/dsi/fastutil/objects/Object2ObjectLinkedOpenHashMap;Lnet/minecraft/client/renderer/RenderType;)V'
            },
            'transformer': function(method) {
                var ASM = Java.type('net.minecraftforge.coremod.api.ASMAPI');
                var Opcodes = Java.type('org.objectweb.asm.Opcodes');
                var InsnList = Java.type('org.objectweb.asm.tree.InsnList');
                var VarInsnNode = Java.type('org.objectweb.asm.tree.VarInsnNode');

                var newInstructions = new InsnList();

                newInstructions.add(new VarInsnNode(Opcodes.ALOAD, 0));
                newInstructions.add(ASM.buildMethodCall(
                    "vazkii/quark/base/handler/AsmHooks",
                    "addGlintTypes",
                    "(Lit/unimi/dsi/fastutil/objects/Object2ObjectLinkedOpenHashMap;)V",
                    ASM.MethodType.STATIC
                ));

                method.instructions.insertBefore(method.instructions.getFirst(), newInstructions);
                return method;
            }
        },

        'extract-item-color': {
            'target': {
                'type': 'METHOD',
                'class': 'net.minecraft.client.renderer.ItemRenderer',
                'methodName': 'func_229111_a_', // renderItem
                'methodDesc': '(Lnet/minecraft/item/ItemStack;Lnet/minecraft/client/renderer/model/ItemCameraTransforms$TransformType;ZLcom/mojang/blaze3d/matrix/MatrixStack;Lnet/minecraft/client/renderer/IRenderTypeBuffer;IILnet/minecraft/client/renderer/model/IBakedModel;)V'
            },
            'transformer': function(method) {
                var ASM = Java.type('net.minecraftforge.coremod.api.ASMAPI');
                var Opcodes = Java.type('org.objectweb.asm.Opcodes');
                var InsnList = Java.type('org.objectweb.asm.tree.InsnList');
                var VarInsnNode = Java.type('org.objectweb.asm.tree.VarInsnNode');

                // add a call to set the target stack to the current item being rendered
                var newInstructions = new InsnList();
                newInstructions.add(new VarInsnNode(Opcodes.ALOAD, 1));
                newInstructions.add(ASM.buildMethodCall(
                    "vazkii/quark/base/handler/AsmHooks",
                    "setColorRuneTargetStack",
                    "(Lnet/minecraft/item/ItemStack;)V",
                    ASM.MethodType.STATIC
                ));
                method.instructions.insertBefore(method.instructions.getFirst(), newInstructions);
                return method;
            }
        },

        'extract-elytra-color': {
            'target': {
                'type': 'METHOD',
                'class': 'net.minecraft.client.renderer.entity.layers.ElytraLayer',
                'methodName': 'func_225628_a_', // render
                'methodDesc': '(Lcom/mojang/blaze3d/matrix/MatrixStack;Lnet/minecraft/client/renderer/IRenderTypeBuffer;ILnet/minecraft/entity/LivingEntity;FFFFFF)V'
            },
            'transformer': function(method) {
                var ASM = Java.type('net.minecraftforge.coremod.api.ASMAPI');
                var Opcodes = Java.type('org.objectweb.asm.Opcodes');
                var VarInsnNode = Java.type('org.objectweb.asm.tree.VarInsnNode');
                var InsnList = Java.type('org.objectweb.asm.tree.InsnList');

                return injectForEachMethod(method,
                    ASM.MethodType.VIRTUAL,
                    "com/mojang/blaze3d/matrix/MatrixStack",
                    ASM.mapMethod("func_227860_a_"), // push
                    "()V",
                    function (target) {
                        var newInstructions = new InsnList();
                        newInstructions.add(new VarInsnNode(Opcodes.ALOAD, 11));
                        newInstructions.add(ASM.buildMethodCall(
                            "vazkii/quark/base/handler/AsmHooks",
                            "setColorRuneTargetStack",
                            "(Lnet/minecraft/item/ItemStack;)V",
                            ASM.MethodType.STATIC
                        ));

                        method.instructions.insertBefore(target, newInstructions);
                    });
            }
        },

        'extract-armor-color': {
            'target': {
                'type': 'METHOD',
                'class': 'net.minecraft.client.renderer.entity.layers.ArmorLayer',
                'methodName': 'func_229129_a_', // renderArmorPart
                'methodDesc': '(Lcom/mojang/blaze3d/matrix/MatrixStack;Lnet/minecraft/client/renderer/IRenderTypeBuffer;Lnet/minecraft/entity/LivingEntity;FFFFFFLnet/minecraft/inventory/EquipmentSlotType;I)V'
            },
            'transformer': function(method) {
                var ASM = Java.type('net.minecraftforge.coremod.api.ASMAPI');
                var Opcodes = Java.type('org.objectweb.asm.Opcodes');
                var VarInsnNode = Java.type('org.objectweb.asm.tree.VarInsnNode');
                var InsnList = Java.type('org.objectweb.asm.tree.InsnList');

                var newInstructions = new InsnList();
                return injectForEachMethod(method,
                    ASM.MethodType.VIRTUAL,
                    "net/minecraft/client/renderer/entity/layers/ArmorLayer",
                    ASM.mapMethod("func_215337_a"), // getModelFromSlot
                    "(Lnet/minecraft/inventory/EquipmentSlotType;)Lnet/minecraft/client/renderer/entity/model/BipedModel;",
                    function (target) {
                        var newInstructions = new InsnList();
                        newInstructions.add(new VarInsnNode(Opcodes.ALOAD, 12));
                        newInstructions.add(ASM.buildMethodCall(
                            "vazkii/quark/base/handler/AsmHooks",
                            "setColorRuneTargetStack",
                            "(Lnet/minecraft/item/ItemStack;)V",
                            ASM.MethodType.STATIC
                        ));

                        method.instructions.insertBefore(target, newInstructions);
                    });

                return method;
            }
        }
    }
}
